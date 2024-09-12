import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/libs/mongodb";
import Users from "@/models/Users";
const bcrypt = require("bcrypt");

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        await connect();
        let { email, password } = await request.json();
        let isExist = await Users.findOne({ email: email }) ?? false;
        if(isExist){
            return NextResponse.json({ status: 402, message: "Email already exists!" });  
        }
        
        let hashedPassword = await bcrypt.hash(password, 6);
        await Users.create({
            email: email,
            password: hashedPassword,
        });
        
        return NextResponse.json({ status: 200, message: "SignUp Successfully!" });  
    } catch (error) {
        return NextResponse.error();
    }
}