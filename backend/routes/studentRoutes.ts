import express from "express";
import Studentcontroller from "../controllers/studentcontroller.js";
import { requireRole } from "../middlewares/auth.js";
import { Request, Response } from "express";

const studentroutes = express.Router();
const studentcontroller = new Studentcontroller();

/**
 * @openapi
 * tags:
 *   name: Student
 *   description: Student profile management
 */

/**
 * @openapi
 * /api/student/create:
 *   post:
 *     summary: Create a student profile
 *     description: Creates a profile for the authenticated student. Each user can only have one profile.
 *     tags: [Student]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentProfile'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Student created successfully
 *                 student:
 *                   $ref: '#/components/schemas/StudentProfile'
 *       400:
 *         description: Profile already exists or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not STUDENT
 */
studentroutes.post("/create", requireRole("STUDENT"), (req: Request, res: Response) => {
    studentcontroller.createStudent(req, res);
});

/**
 * @openapi
 * /api/student/profile:
 *   get:
 *     summary: Get my student profile
 *     description: Returns the profile of the currently authenticated student.
 *     tags: [Student]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Student profile returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student:
 *                   $ref: '#/components/schemas/StudentProfile'
 *       400:
 *         description: Profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not STUDENT
 */
studentroutes.get("/profile", requireRole("STUDENT"), (req: Request, res: Response) => {
    studentcontroller.getStudent(req, res);
});

/**
 * @openapi
 * /api/student/profile:
 *   put:
 *     summary: Update my student profile
 *     description: Updates the profile fields for the currently authenticated student.
 *     tags: [Student]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 student:
 *                   $ref: '#/components/schemas/StudentProfile'
 *       400:
 *         description: Update failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not STUDENT
 */
studentroutes.put("/profile", requireRole("STUDENT"), (req: Request, res: Response) => {
    studentcontroller.updateProfile(req, res);
});

export default studentroutes;
