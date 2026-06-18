import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

vi.mock("../../db/prisma.js", () => {
    const m = {
        judge: {
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
        },
    };
    return { default: m };
});

// Judge controller calls auth.api.getSession internally — mock it
vi.mock("../../db/auth.js", () => ({
    auth: {
        api: {
            getSession: vi.fn().mockResolvedValue({
                user: { id: "user-1", role: "JUDGE", name: "Judge One", email: "j@j.com" }
            })
        }
    }
}));

vi.mock("../../middlewares/auth.js", () => ({
    requireRole: (_role: string) => (req: any, _res: any, next: any) => {
        req.user = { id: "user-1", role: "JUDGE", name: "Judge One", email: "j@j.com" };
        next();
    },
}));

import prisma from "../../db/prisma.js";
import { auth } from "../../db/auth.js";
import judgerouter from "../../routes/judgeRoutes.js";

const db = prisma as any;
const authMock = auth.api.getSession as ReturnType<typeof vi.fn>;

function buildApp() {
    const app = express();
    app.use(express.json());
    app.use("/api/judge", judgerouter);
    return app;
}

beforeEach(() => {
    // Only reset Prisma mocks — don't wipe the auth session mock
    vi.clearAllMocks();
    authMock.mockResolvedValue({
        user: { id: "user-1", role: "JUDGE", name: "Judge One", email: "j@j.com" }
    });
});

const judgePayload = {
    organization: "TechCorp",
    designation: "Lead Engineer",
    expertise: ["Backend", "DevOps"],
    experience: 7,
    bio: "Experienced software engineer",
};

// ── POST /api/judge ───────────────────────────────────────────────────────────
describe("POST /api/judge", () => {
    it("returns 200 when judge profile is created", async () => {
        db.judge.findUnique.mockResolvedValue(null);
        const created = { id: "j1", userId: "user-1", ...judgePayload };
        db.judge.create.mockResolvedValue(created);

        const res = await request(buildApp())
            .post("/api/judge")
            .send(judgePayload);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(created);
    });

    it("returns 500 when judge profile already exists", async () => {
        db.judge.findUnique.mockResolvedValue({ id: "existing" });

        const res = await request(buildApp())
            .post("/api/judge")
            .send(judgePayload);

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Judge already exists");
    });
});

// ── GET /api/judge ────────────────────────────────────────────────────────────
describe("GET /api/judge", () => {
    it("returns 200 with the judge profile", async () => {
        const judge = { id: "j1", userId: "user-1" };
        db.judge.findUnique.mockResolvedValue(judge);

        const res = await request(buildApp()).get("/api/judge");

        expect(res.status).toBe(200);
        expect(res.body).toEqual(judge);
    });
});

// ── PUT /api/judge ────────────────────────────────────────────────────────────
describe("PUT /api/judge", () => {
    it("returns 200 with the updated judge profile", async () => {
        const updated = { id: "j1", userId: "user-1", bio: "Updated bio" };
        db.judge.update.mockResolvedValue(updated);

        const res = await request(buildApp())
            .put("/api/judge")
            .send({ bio: "Updated bio" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(updated);
    });
});
