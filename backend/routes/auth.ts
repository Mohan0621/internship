import { toNodeHandler } from "better-auth/node";
import { auth } from "../db/auth.js";

// Export the Better Auth Node.js handler.
// This handles all auth endpoints (like sign-in, sign-up, sign-out, get-session, etc.)
export const authHandler = toNodeHandler(auth);
