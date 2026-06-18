import express from "express";
import JudgeController from "../controllers/judgecontroller.js";
import JudgeService from "../services/judgeservices.js";
import { requireRole } from "../middlewares/auth.js";

const judgerouter = express.Router();
const judgeService = new JudgeService();
const judgeController = new JudgeController(judgeService);

/**
 * @openapi
 * tags:
 *   name: Judge
 *   description: Judge profile management
 */

/**
 * @openapi
 * /api/judge:
 *   post:
 *     summary: Create a judge profile
 *     description: Creates a profile for the authenticated judge. Each user can only have one judge profile.
 *     tags: [Judge]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JudgeProfile'
 *     responses:
 *       200:
 *         description: Judge profile created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JudgeProfile'
 *       500:
 *         description: Profile already exists or server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not JUDGE
 */
judgerouter.post("/", requireRole("JUDGE"), judgeController.createJudge.bind(judgeController));

/**
 * @openapi
 * /api/judge:
 *   get:
 *     summary: Get my judge profile
 *     description: Returns the profile of the currently authenticated judge.
 *     tags: [Judge]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Judge profile returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JudgeProfile'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not JUDGE
 */
judgerouter.get("/", requireRole("JUDGE"), judgeController.getJudgeProfile.bind(judgeController));

/**
 * @openapi
 * /api/judge:
 *   put:
 *     summary: Update my judge profile
 *     description: Updates fields on the currently authenticated judge's profile.
 *     tags: [Judge]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JudgeProfile'
 *     responses:
 *       200:
 *         description: Profile updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JudgeProfile'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not JUDGE
 */
judgerouter.put("/", requireRole("JUDGE"), judgeController.updateJudge.bind(judgeController));

export default judgerouter;
