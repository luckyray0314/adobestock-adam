"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Cookies from "universal-cookie";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { items } from "./sidebar-items";
import { Avatar, Button, Card, CardBody, CardFooter, ScrollShadow, Spacer, image } from "@nextui-org/react";

import { verifyJwtToken } from "@/libs/auth";
import Sidebar from "./sidebar";

import { useAtom } from "jotai";
import { ImageFiles, isGenerateKey, ImageData } from "../Jotai/atoms";
import { Spinner } from "@nextui-org/react";
const axios = require('axios');

const APIKEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
/**
 * 💡 TIP: You can use the usePathname hook from Next.js App Router to get the current pathname
 * and use it as the active key for the Sidebar component.
 *
 * ```tsx
 * import {usePathname} from "next/navigation";
 *
 * const pathname = usePathname();
 * const currentPath = pathname.split("/")?.[1]
 *
 * <Sidebar defaultSelectedKey="home" selectedKeys={[currentPath]} />
 * ```
 */
interface ImgData {
    filename: string;
    title: string;
    tags: string[];
}

export default function Component() {
    const { data: session } = useSession();
    const [files, setFiles] = useAtom<any>(ImageFiles);
    const [isloading, setLoading] = useState<any>(false);
    const [imgdata, setData] = useAtom<ImgData[]>(ImageData);
    const [isGenerate, setGenerate] = useAtom<any>(isGenerateKey);

    let api_endpoint = "https://api.openai.com/v1/chat/completions";
    let headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + APIKEY,
    };

    const initLoginState = async () => {
        const cookies = new Cookies();
        const token = cookies.get("token");

        if (token) {
            const verifiedToken = await verifyJwtToken(token);
            if (verifiedToken) {
                setLoggedIn(verifiedToken);
            }
        }

        return false;
    };

    const [user, setLoggedIn] = useState<any>(false);

    // encode the image into Base64
    function encodeImage(image: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(image);
        });
    }

    // Download the CSV file
    const generateCSV = () => {
        let csvContent = 'data:text/csv;charset=utf-8,';

        // Add column headers
        csvContent += "FileName,Title,Tag\n";

        // iterate over the arrays to form the csv content
        for (let i = 0; i < imgdata.length; i++) {
            csvContent += `${imgdata[i]["filename"]},${imgdata[i]["title"]},${imgdata[i]["tags"]}\n`;
        }

        let encodedUri = encodeURI(csvContent);

        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_data.csv");
        document.body.appendChild(link);

        link.click();
    }

    // Generate Keywards
    const generateKey = async () => {
        console.log("Click!");
        setLoading(true);

        let updateData:any = [];

        files.forEach(async (imageFile: File) => {
            // Resize the image to 510x510 pixels
            const base64_image = await encodeImage(imageFile);
            var image_data:any = {};
            image_data.filename = imageFile.name;

            let payload = {
                "model": "gpt-4-vision-preview",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "I want thirty keywords to describe this image for Adobe Stock, targeted towards discoverability. Please include the ones that are relevant or location specific. Please output them comma separated. Please as the first entry, output an editorialized title, also separated by commas. Don't output any other characters.",
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": base64_image
                                },
                            },
                        ],
                    }
                ],
                "max_tokens": 300,
            };

            // Make the API request
            await axios.post(api_endpoint, payload, { headers: headers })
                .then((response: any) => {
                    let result = response.data.choices[0].message.content;
                    let result_entries = result.split(", ");
                    
                    image_data.title = result_entries[0];
                    image_data.tags = result_entries.slice(1);
                    updateData.push(image_data);
                    
                    if (files.length == updateData.length) {
                        setGenerate(true);
                        setLoading(false);
                        console.log("--------------Fire!");
                    }
                })
                .catch(console.error)
        }
        );

        setData(updateData);
    }

    const handleSignOut = async () => {
        const cookies = new Cookies();
        cookies.remove('token', { path: '/' });
        signOut();
        localStorage.removeItem('user');
    }

    useEffect(() => {
        if (session) setLoggedIn(session?.user);
        else {
            initLoginState();
        }
    }, [session])

    return (
        <div className="h-dvh">
            <div className="relative flex h-full w-72 flex-1 flex-col border-r-small border-divider p-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
                        <Image src="https://cdn.prod.website-files.com/img/favicon.ico" width={40} height={40} alt="" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-small font-bold uppercase">Keyworder</span>
                        <span className="text-small">Microstock Keywording Tool</span>
                    </div>
                </div>
                <Spacer y={12} />
                <div className="flex items-center gap-3 px-4">
                    <Avatar isBordered size="sm" src={user?.image} />
                    <div className="flex flex-col">
                        <p className="text-small font-medium text-default-600">{user?.name ? user?.name : user?.email}</p>
                    </div>
                </div>
                <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
                    <Sidebar defaultSelectedKey="home" items={items} />
                    <Card className="overflow-visible" shadow="sm">
                        <CardBody className="items-center py-5 text-center gap-6">
                            <Button className="px-10 shadow-md" color="primary" radius="full" variant="shadow" onClick={generateKey} isDisabled={isloading || isGenerate}>
                                {
                                    isloading ? <><Spinner color="white" className="p-1" /></> : "Generate Keyward"
                                }
                            </Button>
                            <Button className="px-10 shadow-md" color="secondary" radius="full" variant="shadow" onClick={generateCSV} isDisabled={!isGenerate}>
                                🚀 Download CSV
                            </Button>
                        </CardBody>
                    </Card>
                </ScrollShadow>
                <div className="mt-auto flex flex-col">
                    <Button
                        fullWidth
                        className="justify-start text-default-500 data-[hover=true]:text-foreground"
                        startContent={
                            <Icon className="text-default-500" icon="solar:info-circle-line-duotone" width={24} />
                        }
                        variant="light"
                    >
                        Help & Information
                    </Button>
                    <Button
                        className="justify-start text-default-500 data-[hover=true]:text-foreground"
                        startContent={
                            <Icon
                                className="rotate-180 text-default-500"
                                icon="solar:minus-circle-line-duotone"
                                width={24}
                            />
                        }
                        variant="light"
                        onClick={() => handleSignOut()}
                    >
                        Log Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
