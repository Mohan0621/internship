import express from "express";
import TeamController from "../controllers/teamcontroller.js";
import { requireRole, requireLogin } from "../middlewares/auth.js";

const teamroutes = express.Router();
const teamcontroller = new TeamController();

/**
 * @openapi
 * tags:
 *   name: Team
 *   description: Team creation and member management
 */

/**
 * @openapi
 * /api/team:
 *   get:
 *     summary: Get all teams
 *     description: Returns every team in the platform including members and team leader info.
 *     tags: [Team]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teams:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 *       401:
 *         description: Not authenticated
 */
teamroutes.get("/", requireLogin, teamcontroller.getTeams);

/**
 * @openapi
 * /api/team/my:
 *   get:
 *     summary: Get my teams
 *     description: Returns all teams where the authenticated user is the creator or a member.
 *     tags: [Team]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teams:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 *       401:
 *         description: Not authenticated
 */
teamroutes.get("/my", requireLogin, teamcontroller.getMyTeams);

/**
 * @openapi
 * /api/team/name/{name}:
 *   get:
 *     summary: Get team by name
 *     tags: [Team]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         example: Alpha Squad
 *     responses:
 *       200:
 *         description: Team found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 */
teamroutes.get("/name/:name", requireLogin, teamcontroller.getTeamByName);

/**
 * @openapi
 * /api/team/{id}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Team]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clxyz123
 *     responses:
 *       200:
 *         description: Team found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       404:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 */
teamroutes.get("/:id", requireLogin, teamcontroller.getTeamById);

/**
 * @openapi
 * /api/team:
 *   post:
 *     summary: Create a team
 *     description: Creates a new team. The authenticated student is set as the creator. Optionally specify a teamLeaderId and initial members.
 *     tags: [Team]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeamRequest'
 *     responses:
 *       201:
 *         description: Team created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team created successfully
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         description: Duplicate team name or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not STUDENT
 */
teamroutes.post("/", requireRole("STUDENT"), teamcontroller.createTeam);

/**
 * @openapi
 * /api/team/{id}:
 *   put:
 *     summary: Update a team
 *     description: Update the name or team leader of a team by its ID.
 *     tags: [Team]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clxyz123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTeamRequest'
 *     responses:
 *       200:
 *         description: Team updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Team updated successfully
 *                 team:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         description: Team not found or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not STUDENT
 */
teamroutes.put("/:id", requireRole("STUDENT"), teamcontroller.updateTeam);

/**
 * @openapi
 * /api/team/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Team]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clxyz123
 *     responses:
 *       200:
 *         description: Team deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Team not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not STUDENT
 */
teamroutes.delete("/:id", requireRole("STUDENT"), teamcontroller.deleteTeam);

/**
 * @openapi
 * /api/team/{id}/members:
 *   post:
 *     summary: Add a member to a team
 *     tags: [Team]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Team ID
 *         schema:
 *           type: string
 *         example: clxyz123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberRequest'
 *     responses:
 *       201:
 *         description: Member added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Member added successfully
 *                 member:
 *                   $ref: '#/components/schemas/TeamMember'
 *       400:
 *         description: Already a member or validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not STUDENT
 */
teamroutes.post("/:id/members", requireRole("STUDENT"), teamcontroller.addMember);

/**
 * @openapi
 * /api/team/{id}/members:
 *   delete:
 *     summary: Remove a member from a team
 *     tags: [Team]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Team ID
 *         schema:
 *           type: string
 *         example: clxyz123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MemberRequest'
 *     responses:
 *       200:
 *         description: Member removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Member not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Role not STUDENT
 */
teamroutes.delete("/:id/members", requireRole("STUDENT"), teamcontroller.removeMember);

export default teamroutes;
