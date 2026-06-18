import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

function createAccessPayload(role: string, userId: number) {
    return {
        role,
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        jti: uuidv4(),
        type: "access"
    };
}

function createRefreshPayload(role: string, userId: number) {
    return {
        role,
        sub: userId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 36000,
        jti: uuidv4(),
        type: "refresh"
    };
}

function createAccessTokenFromRefresh(refreshToken: string): string {
    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET!
    ) as any;

    const payload = createAccessPayload(
        decoded.role,
        decoded.sub
    );

    return jwt.sign(payload, process.env.JWT_SECRET!);
}

function getAccessToken(req: any, res: any): string {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
        const payload = createAccessPayload(
            req.body.role,
            req.body.user_id
        );

        return jwt.sign(payload, process.env.JWT_SECRET!);
    }

    return createAccessTokenFromRefresh(refreshToken);
}

function createrefreshToken(role: string, userId: number): string {
    const payload = createRefreshPayload(role, userId);

    return jwt.sign(payload, process.env.JWT_SECRET!);
}

function checkValidToken(token: string): boolean {
    if (jwt.verify(token, process.env.JWT_SECRET!)) {
        return true;
    }
    return false;
}

function getPayload(token: string) {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    return payload;
}

import { auth } from "../db/auth.ts"

async function getuserid(req: any, res: any) {
    const sessions = await auth.api.getSession(req, res)
    if (!sessions) {
        return null;
    }
    return sessions.userId;
}

export {
    getAccessToken,
    createrefreshToken,
    checkValidToken,
    createAccessTokenFromRefresh,
    getPayload
}