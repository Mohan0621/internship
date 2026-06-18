// Extends Express Request to include the user object set by auth middleware
declare namespace Express {
    interface Request {
        user: {
            id: string;
            email: string;
            role: "STUDENT" | "JUDGE" | "ADMIN";
            name: string;
        };
    }
}
