import express from "express";
import Studentcontroller from "../controllers/studentcontroller.js";
import { requireRole } from "../middlewares/auth.js";
import { Request, Response } from "express"
const studentroutes = express.Router();
const studentcontroller = new Studentcontroller();


studentroutes.post("/create", requireRole("STUDENT"), (req: Request, res: Response) => {
    studentcontroller.createStudent(req, res);
});

studentroutes.get("/profile", requireRole("STUDENT"), (req: Request, res: Response) => {
    studentcontroller.getStudent(req, res);
});

studentroutes.put("/profile", requireRole("STUDENT"), (req: Request, res: Response) => {
    studentcontroller.updateProfile(req, res);
});

export default studentroutes;
