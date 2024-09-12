import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/libs/auth";
import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/libs/mongodb";
import Users from "@/models/Users";
const bcrypt = require("bcrypt");

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        await connect();
        let { email, password } = await request.json();
        let user = await Users.findOne({ email: email }) ?? false;
        if(!user){
            return NextResponse.json({ status: 402, message: "User does not exist!" });  
        }
        
        let isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            return NextResponse.json({ status: 403, message: "Password does not match!" });
        }
        
        const token = await new SignJWT({
            email: email, createdAt: user?.createdAt
        })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d") 
        .sign(getJwtSecretKey());
        
        const response = NextResponse.json(
            { message: "Signin Successfully!", data:user, status: 200, headers: { "content-type": "application/json" } }
        );
        response.cookies.set({
            name: "token",
            value: token,
            path: "/",
        });
        return response;
    } catch (error) {
        return NextResponse.error();
    }
}