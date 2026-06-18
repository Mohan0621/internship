import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../db/prisma.js", () => {
    const prismaMock = {
        judge: {
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        },
    };
    return { default: prismaMock };
});

import prisma from "../../db/prisma.js";
import JudgeService from "../../services/judgeservices.js";

const prismaMock = prisma as any;
const svc = new JudgeService();

beforeEach(() => {
    vi.clearAllMocks();
});

const judgeData = {
    organization: "OpenAI",
    designation: "Senior Engineer",
    expertise: ["ML", "Infra"],
    experience: 5,
    bio: "Experienced engineer",
};

// ── createJudge ───────────────────────────────────────────────────────────────
describe("JudgeService.createJudge", () => {
    it("creates a judge profile when none exists", async () => {
        prismaMock.judge.findUnique.mockResolvedValue(null);
        const created = { id: "j1", userId: "u1", ...judgeData };
        prismaMock.judge.create.mockResolvedValue(created);

        const result = await svc.createJudge(judgeData, "u1");

        expect(prismaMock.judge.findUnique).toHaveBeenCalledOnce();
        expect(prismaMock.judge.create).toHaveBeenCalledOnce();
        expect(result).toEqual(created);
    });

    it("throws when a judge profile already exists", async () => {
        prismaMock.judge.findUnique.mockResolvedValue({ id: "existing" });

        await expect(svc.createJudge(judgeData, "u1")).rejects.toThrow(
            "Judge already exists"
        );

        expect(prismaMock.judge.create).not.toHaveBeenCalled();
    });
});

// ── getJudgeById ──────────────────────────────────────────────────────────────
describe("JudgeService.getJudgeById", () => {
    it("returns the judge when found", async () => {
        const judge = { id: "j1", userId: "u1" };
        prismaMock.judge.findUnique.mockResolvedValue(judge);

        const result = await svc.getJudgeById("j1");

        expect(result).toEqual(judge);
    });

    it("returns null when judge is not found", async () => {
        prismaMock.judge.findUnique.mockResolvedValue(null);

        const result = await svc.getJudgeById("missing");

        expect(result).toBeNull();
    });
});

// ── updateJudge ───────────────────────────────────────────────────────────────
describe("JudgeService.updateJudge", () => {
    it("updates and returns the judge profile", async () => {
        const updated = { id: "j1", userId: "u1", bio: "Updated bio" };
        prismaMock.judge.update.mockResolvedValue(updated);

        const result = await svc.updateJudge({ bio: "Updated bio" }, "u1");

        expect(prismaMock.judge.update).toHaveBeenCalledOnce();
        expect(result).toEqual(updated);
    });
});
