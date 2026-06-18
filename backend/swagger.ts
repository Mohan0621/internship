import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Internship Platform API",
            version: "1.0.0",
            description:
                "REST API for the internship platform. Covers authentication, student profiles, judge profiles, and team management.",
        },
        servers: [
            {
                url: "http://localhost:3002",
                description: "Local development server",
            },
        ],
        components: {
            securitySchemes: {
                // Better-Auth uses a session cookie — document it here
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "better-auth.session_token",
                    description:
                        "Session cookie set automatically by Better Auth after login. Use POST /api/auth/sign-in/email to obtain it.",
                },
            },
            schemas: {
                // ── Auth ────────────────────────────────────────────────────
                SignInRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", format: "email", example: "user@example.com" },
                        password: { type: "string", format: "password", example: "secret123" },
                    },
                },
                SignUpRequest: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", example: "Mohan Kumar" },
                        email: { type: "string", format: "email", example: "mohan@example.com" },
                        password: { type: "string", format: "password", example: "secret123" },
                        role: {
                            type: "string",
                            enum: ["STUDENT", "JUDGE", "ADMIN"],
                            default: "STUDENT",
                        },
                    },
                },

                // ── Student ─────────────────────────────────────────────────
                StudentProfile: {
                    type: "object",
                    required: ["rollNumber", "department", "collegeName", "phonenumber", "year"],
                    properties: {
                        rollNumber: { type: "string", example: "CS2021001" },
                        department: { type: "string", example: "Computer Science" },
                        collegeName: { type: "string", example: "MIT" },
                        phonenumber: { type: "integer", example: 9876543210 },
                        year: { type: "integer", minimum: 1, maximum: 5, example: 2 },
                        cgpa: { type: "number", format: "float", example: 8.5 },
                        githubUrl: {
                            type: "string",
                            format: "uri",
                            nullable: true,
                            example: "https://github.com/mohan",
                        },
                        leetcode: {
                            type: "string",
                            nullable: true,
                            example: "https://leetcode.com/mohan",
                        },
                        portfolio: {
                            type: "string",
                            format: "uri",
                            nullable: true,
                            example: "https://mohan.dev",
                        },
                        linkedin: {
                            type: "string",
                            format: "uri",
                            nullable: true,
                            example: "https://linkedin.com/in/mohan",
                        },
                    },
                },

                // ── Judge ────────────────────────────────────────────────────
                JudgeProfile: {
                    type: "object",
                    properties: {
                        organization: { type: "string", example: "Google" },
                        designation: { type: "string", example: "Senior SWE" },
                        expertise: {
                            type: "array",
                            items: { type: "string" },
                            example: ["Backend", "DevOps"],
                        },
                        experience: { type: "integer", example: 7 },
                        bio: {
                            type: "string",
                            example: "Experienced engineer passionate about open source.",
                        },
                    },
                },

                // ── Team ─────────────────────────────────────────────────────
                CreateTeamRequest: {
                    type: "object",
                    required: ["name"],
                    properties: {
                        name: { type: "string", example: "Alpha Squad" },
                        teamLeaderId: {
                            type: "string",
                            example: "student-cuid-123",
                            description:
                                "Student id to assign as team leader. Defaults to the authenticated user's student id.",
                        },
                        members: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["studentId"],
                                properties: {
                                    studentId: { type: "string", example: "student-cuid-456" },
                                },
                            },
                            example: [{ studentId: "student-cuid-456" }],
                        },
                    },
                },
                UpdateTeamRequest: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "Alpha Squad Renamed" },
                        teamLeaderId: { type: "string", example: "student-cuid-789" },
                    },
                },
                MemberRequest: {
                    type: "object",
                    required: ["studentId"],
                    properties: {
                        studentId: { type: "string", example: "student-cuid-456" },
                    },
                },
                Team: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "clxyz123" },
                        name: { type: "string", example: "Alpha Squad" },
                        createdBy: { type: "string", example: "user-cuid-123" },
                        teamLeaderId: { type: "string", example: "student-cuid-123" },
                        members: {
                            type: "array",
                            items: { $ref: "#/components/schemas/TeamMember" },
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                TeamMember: {
                    type: "object",
                    properties: {
                        id: { type: "string", example: "tm-cuid-123" },
                        teamId: { type: "string", example: "clxyz123" },
                        studentId: { type: "string", example: "student-cuid-456" },
                    },
                },

                // ── Generic responses ────────────────────────────────────────
                MessageResponse: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Operation successful" },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        message: { type: "string", example: "Something went wrong" },
                    },
                },
            },
        },
        security: [{ cookieAuth: [] }],
    },
    // glob patterns pointing at all route files that have JSDoc comments
    apis: ["./backend/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
