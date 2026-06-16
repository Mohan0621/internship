import express from "express"
import { toNodeHandler } from "better-auth/node";
import {auth} from "../controllers/authcontroller"
const router=express.Router()

router.use(toNodeHandler(auth));

export default router;