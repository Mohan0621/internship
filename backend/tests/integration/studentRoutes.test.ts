import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

vi.mock("../../db/prisma.js", () => {
    const m = {
        student: {
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        },
    };
    return { default: m };
});

vi.mock("../../middlewares/auth.js", () => ({
    requireRole: (_role: string) => (req: any, _res: any, next: any) => {
        req.user = { id: "user-1", role: "STUDENT", name: "Test", email: "t@t.com" };
        next();
    },
}));

import prisma from "../../db/prisma.js";
import studentroutes from "../../routes/studentRoutes.js";

const db = prisma as any;

function buildApp() {
    const app = express();
    app.use(express.json());
    app.use("/api/student", studentroutes);
    return app;
}

beforeEach(() => {
    vi.clearAllMocks();
});

const payload = {
    rollNumber: "CS001",
    department: "CSE",
    collegeName: "MIT",
    phonenumber: 9876543210,
    year: 2,
    cgpa: 8.5,
    githubUrl: "https://github.com/test",
    leetcode: null,
    portfolio: null,
    linkedin: null,
};

// ── POST /api/student/create ──────────────────────────────────────────────────
describe("POST /api/student/create", () => {
    it("returns 201 when profile is created", async () => {
        db.student.findUnique.mockResolvedValue(null);
        const created = { id: "s1", userId: "user-1", ...payload };
        db.student.create.mockResolvedValue(created);

        const res = await request(buildApp())
            .post("/api/student/create")
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Student created successfully");
        expect(res.body.student).toEqual(created);
    });

    it("returns 400 when profile already exists", async () => {
        db.student.findUnique.mockResolvedValue({ id: "existing" });

        const res = await request(buildApp())
            .post("/api/student/create")
            .send(payload);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Student profile already exists");
    });
});

// ── GET /api/student/profile ──────────────────────────────────────────────────
describe("GET /api/student/profile", () => {
    it("returns 200 with the student profile", async () => {
        const student = { id: "s1", userId: "user-1" };
        db.student.findUnique.mockResolvedValue(student);

        const res = await request(buildApp()).get("/api/student/profile");

        expect(res.status).toBe(200);
        expect(res.body.student).toEqual(student);
    });

    it("returns 400 when profile is not found", async () => {
        db.student.findUnique.mockResolvedValue(null);

        const res = await request(buildApp()).get("/api/student/profile");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Student profile not found");
    });
});

// ── PUT /api/student/profile ──────────────────────────────────────────────────
describe("PUT /api/student/profile", () => {
    it("returns 200 with the updated profile", async () => {
        const updated = { id: "s1", userId: "user-1", department: "IT" };
        db.student.update.mockResolvedValue(updated);

        const res = await request(buildApp())
            .put("/api/student/profile")
            .send({ department: "IT" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Profile updated successfully");
        expect(res.body.student).toEqual(updated);
    });
});
