<<<<<<< HEAD
import { Request, Response } from "express";
import { auth } from "../db/auth.js";

export default class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: "Email and password are required" });
                return;
            }

            // Call Better Auth programmatic server API
            const response = await auth.api.signInEmail({
                body: {
                    email,
                    password,
                },
                asResponse: true
            });

            // Copy Better Auth response status and headers (like Set-Cookie)
            res.status(response.status);
            response.headers.forEach((value, key) => {
                res.setHeader(key, value);
            });

            const data = await response.json();
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Login failed" });
        }
    }

    async registration(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password) {
                res.status(400).json({ message: "Name, email, and password are required" });
                return;
            }

            // Call Better Auth programmatic server API to register user
            const response = await auth.api.signUpEmail({
                body: {
                    name,
                    email,
                    password,
                    role: role || "user"
                },
                asResponse: true
            });

            res.status(response.status);
            response.headers.forEach((value, key) => {
                res.setHeader(key, value);
            });

            const data = await response.json();
            res.json(data);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Registration failed" });
        }
    }

    async refresh(req: Request, res: Response): Promise<void> {
        try {
            // Better Auth sessions are managed automatically via session cookies.
            // We can return the current active session as the "refresh" response.
            const session = await auth.api.getSession({
                headers: req.headers as any
            });

            if (!session) {
                res.status(401).json({ message: "No active session found" });
                return;
            }

            res.json(session);
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Session verification failed" });
        }
    }
}
=======
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
import {drizzleAdapter} from "@better-auth/drizzle-adapter";
import {db} from "../db/aidb"
import * as schema from "../auth-schema";

export const auth=betterAuth({
    secret:process.env.BETTER_AUTH_SECRET,

    database:drizzleAdapter(db,{
        provider:"pg",
        schema,
    }),

    emailAndPassword:{
        enabled:true,
    },
}) 
>>>>>>> KISHORGUNITHI-main
