import React, { useEffect, useState } from 'react'
import { Card, CardBody, Image, Chip } from "@nextui-org/react";
import { ImageData, isGenerateKey } from '@/components/Jotai/atoms'
import { useAtom } from 'jotai'

interface ImgData {
    filename: string;
    title: string;
    tags: string[];
}

const CardComponent = ({ file }: { file: File }) => {
    const [imgdata, setData] = useAtom<ImgData[]>(ImageData);
    const [isGenerate, setGenerate] = useAtom<any>(isGenerateKey);

    const [tag, setTag] = useState<any>([]);
    const [title, setTitle] = useState<any>("");

    useEffect(() => {
        const data = imgdata.find(item => item["filename"] === file.name)
        if (data) {
            setTag(data["tags"]);
            setTitle(data["title"]);
        } else {
            console.log(`No data found with filename: ${file.name}`);
        }
    }, [isGenerate])

    return (
        <div className='flex my-2 w-full'>
            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 w-full"
                shadow="sm"
            >
                <CardBody>
                    <div className="flex flex-row w-full gap-4">
                        <img
                            className='w-24 h-24 rounded-lg'
                            alt="Album cover"
                            src={URL.createObjectURL(file)}
                        />
                        <div className="flex flex-col justify-between p-1">
                            <div className='flex flex-row gap-2'>
                                <h3 className="font-semibold text-foreground/90">
                                    Image Title:
                                </h3>
                                <p className='text-foreground/80'>
                                    {title}
                                </p>
                            </div>
                            <div className='flex flex-row gap-2 p-2'>
                                {
                                    tag?.map((item: any) =>
                                        <Chip key={item} className='text-foreground/80 text-small text-white m-1' color='primary'>
                                            {item}
                                        </Chip>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default CardComponent