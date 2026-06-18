import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../db/prisma.js", () => {
    const prismaMock = {
        student: {
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        },
    };
    return { default: prismaMock };
});

import prisma from "../../db/prisma.js";
import StudentService from "../../services/studentservices.js";

const prismaMock = prisma as any;
const svc = new StudentService();

beforeEach(() => {
    vi.clearAllMocks();
});

const studentData = {
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

// ── createStudent ─────────────────────────────────────────────────────────────
describe("StudentService.createStudent", () => {
    it("creates a student profile when one does not exist", async () => {
        prismaMock.student.findUnique.mockResolvedValue(null);
        const created = { id: "s1", userId: "u1", ...studentData };
        prismaMock.student.create.mockResolvedValue(created);

        const result = await svc.createStudent("u1", studentData);

        expect(prismaMock.student.findUnique).toHaveBeenCalledOnce();
        expect(prismaMock.student.create).toHaveBeenCalledOnce();
        expect(result).toEqual(created);
    });

    it("throws when a student profile already exists for the user", async () => {
        prismaMock.student.findUnique.mockResolvedValue({ id: "existing" });

        await expect(svc.createStudent("u1", studentData)).rejects.toThrow(
            "Student profile already exists"
        );

        expect(prismaMock.student.create).not.toHaveBeenCalled();
    });
});

// ── getStudent ────────────────────────────────────────────────────────────────
describe("StudentService.getStudent", () => {
    it("returns the student when found", async () => {
        const student = { id: "s1", userId: "u1" };
        prismaMock.student.findUnique.mockResolvedValue(student);

        const result = await svc.getStudent("u1");

        expect(result).toEqual(student);
    });

    it("throws when student profile is not found", async () => {
        prismaMock.student.findUnique.mockResolvedValue(null);

        await expect(svc.getStudent("u-missing")).rejects.toThrow(
            "Student profile not found"
        );
    });
});

// ── updateProfile ─────────────────────────────────────────────────────────────
describe("StudentService.updateProfile", () => {
    it("calls prisma update with the new data and returns the result", async () => {
        const updated = { id: "s1", userId: "u1", department: "IT" };
        prismaMock.student.update.mockResolvedValue(updated);

        const result = await svc.updateProfile("u1", { department: "IT" });

        expect(prismaMock.student.update).toHaveBeenCalledOnce();
        expect(result).toEqual(updated);
    });
});
