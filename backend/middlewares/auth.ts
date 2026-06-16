import {checkValidToken,getPayload} from "../utlites/auth.ts"
import dotenv from "dotenv";
dotenv.config();

function requireLogin(req:any, res:any, next:Function) {
    const token = req.cookies?.refresh_token;

    if (!token) {
        return res.status(401).json({
            message: "login required"
        });
    }

    next();
}

function requireUser(req:any, res:any, next:Function) {
    const token = req.cookies?.refresh_token;

    if (!token) {
        return res.redirect("/auth/login");
    }

    if (!checkValidToken(token)) {
        return res.status(401).json({
            message: "invalid token"
        });
    }

    const payload = getPayload(token);

    if (payload.role !== "user") {
        return res.status(403).json({
            message: "access denied, user login required"
        });
    }

    next();
}

function requireAdmin(req:any, res:any, next:Function) {
    const token = req.cookies?.refresh_token;

    if (!token) {
        return res.redirect("/auth/login");
    }

    if (!checkValidToken(token)) {
        return res.status(401).json({
            message: "invalid token"
        });
    }

    const payload = getPayload(token);

    if (payload.role !== "admin") {
        return res.status(403).json({
            message: "access denied, admin login required"
        });
    }

    next();
}

export {
    requireLogin,
    requireUser,
    requireAdmin
};