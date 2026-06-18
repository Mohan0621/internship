import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../db/auth.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication via Better Auth (session cookies)
 */

/**
 * @openapi
 * /api/auth/sign-in/email:
 *   post:
 *     summary: Sign in with email and password
 *     description: >
 *       Authenticates the user and sets a `better-auth.session_token` cookie.
 *       Use this cookie in all subsequent requests.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         description: Signed in successfully — session cookie is set
 *       401:
 *         description: Invalid credentials
 */

/**
 * @openapi
 * /api/auth/sign-up/email:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account. The role defaults to STUDENT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       200:
 *         description: Account created successfully
 *       400:
 *         description: Email already in use or missing fields
 */

/**
 * @openapi
 * /api/auth/sign-out:
 *   post:
 *     summary: Sign out
 *     description: Invalidates the current session and clears the session cookie.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Signed out successfully
 */

/**
 * @openapi
 * /api/auth/get-session:
 *   get:
 *     summary: Get current session
 *     description: Returns the currently active session and user object if authenticated.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Active session
 *       401:
 *         description: No active session
 */

router.use(toNodeHandler(auth));

export default router;
