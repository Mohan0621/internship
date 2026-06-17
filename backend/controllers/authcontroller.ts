// import {Request, Response} from "express"
// import pool from "../db/connection_pool";

// export const login=async(req:Request,res:Response)=>{
//     console.log("Entered into Login Feature");
//     res.json({"message":"Login Route Hit!!!"});
// };

// export const register=async(req:Request,res:Response)=>{
//     console.log("Entered into the Registration Feature");
//     res.json({"message":"Register Route Hit!!!"});
// };

import "dotenv/config";
import {betterAuth} from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "../db/prisma"

export const auth=betterAuth({
    secret:process.env.BETTER_AUTH_SECRET,

    database:prismaAdapter(prisma,{
        provider:"postgresql",
    }),

    emailAndPassword:{
        enabled:true,
    },
}) 