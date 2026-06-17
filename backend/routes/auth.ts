import { toNodeHandler } from "better-auth/node";
import { auth } from "../db/auth.js";
export const authHandler = toNodeHandler(auth);
