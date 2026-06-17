import { auth } from "../db/auth.ts"; // your better-auth instance

export async function requireLogin(
    req: any,
    res: any,
    next: Function
) {

    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session) {

        return res.status(401).json({
            message: "login required"
        });

    }

    req.user = session.user;

    next();

}

export async function requireUser(
    req: any,
    res: any,
    next: Function
) {

    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session) {

        return res.status(401).json({
            message: "login required"
        });

    }

    if (session.user.role !== "STUDENT") {

        return res.status(403).json({

            message:
                "access denied, student login required"

        });

    }

    req.user = session.user;

    next();

}
export async function requireAdmin(
    req: any,
    res: any,
    next: Function
) {

    const session = await auth.api.getSession({
        headers: req.headers
    });

    if (!session) {

        return res.status(401).json({
            message: "login required"
        });

    }

    if (session.user.role !== "ADMIN") {

        return res.status(403).json({

            message:
                "access denied, admin login required"

        });

    }

    req.user = session.user;

    next();

}
export const requireRole = (
    role: "STUDENT" | "JUDGE" | "ADMIN"
) => {

    return async (
        req: any,
        res: any,
        next: Function
    ) => {

        const session =
            await auth.api.getSession({
                headers: req.headers
            });

        if (!session) {

            return res.status(401).json({
                message: "login required"
            });

        }

        if (session.user.role !== role) {

            return res.status(403).json({
                message: "access denied"
            });

        }

        req.user = session.user;

        next();

    };

};