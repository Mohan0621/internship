import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

// ── mock Prisma ───────────────────────────────────────────────────────────────
vi.mock("../../db/prisma.js", () => {
    const m = {
        team: {
            findUnique: vi.fn(),
            findMany: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        teamMember: {
            findUnique: vi.fn(),
            findMany: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
        },
    };
    return { default: m };
});

// ── mock auth middleware ───────────────────────────────────────────────────────
vi.mock("../../middlewares/auth.js", () => ({
    requireLogin: (req: any, _res: any, next: any) => {
        req.user = { id: "user-1", role: "STUDENT", name: "Test", email: "t@t.com" };
        next();
    },
    requireRole: (_role: string) => (req: any, _res: any, next: any) => {
        req.user = { id: "user-1", role: "STUDENT", name: "Test", email: "t@t.com" };
        next();
    },
}));

import prisma from "../../db/prisma.js";
import teamroutes from "../../routes/teamroutes.js";

const db = prisma as any;

function buildApp() {
    const app = express();
    app.use(express.json());
    app.use("/api/team", teamroutes);
    return app;
}

beforeEach(() => {
    vi.clearAllMocks();
});

// ── GET /api/team ─────────────────────────────────────────────────────────────
describe("GET /api/team", () => {
    it("returns 200 with a list of teams", async () => {
        const teams = [{ id: "t1", name: "Alpha" }];
        db.team.findMany.mockResolvedValue(teams);

        const res = await request(buildApp()).get("/api/team");

        expect(res.status).toBe(200);
        expect(res.body.teams).toEqual(teams);
    });
});

// ── GET /api/team/my ──────────────────────────────────────────────────────────
describe("GET /api/team/my", () => {
    it("returns 200 with teams belonging to the logged-in user", async () => {
        const teams = [{ id: "t1", createdBy: "user-1" }];
        db.team.findMany.mockResolvedValue(teams);

        const res = await request(buildApp()).get("/api/team/my");

        expect(res.status).toBe(200);
        expect(res.body.teams).toEqual(teams);
    });
});

// ── GET /api/team/name/:name ──────────────────────────────────────────────────
describe("GET /api/team/name/:name", () => {
    it("returns 200 when team is found by name", async () => {
        const team = { id: "t1", name: "Alpha" };
        db.team.findUnique.mockResolvedValue(team);

        const res = await request(buildApp()).get("/api/team/name/Alpha");

        expect(res.status).toBe(200);
        expect(res.body.team).toEqual(team);
    });

    it("returns 404 when team is not found by name", async () => {
        db.team.findUnique.mockResolvedValue(null);

        const res = await request(buildApp()).get("/api/team/name/Ghost");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Team not found");
    });
});

// ── GET /api/team/:id ─────────────────────────────────────────────────────────
describe("GET /api/team/:id", () => {
    it("returns 200 when team is found by id", async () => {
        const team = { id: "t1", name: "Alpha" };
        db.team.findUnique.mockResolvedValue(team);

        const res = await request(buildApp()).get("/api/team/t1");

        expect(res.status).toBe(200);
        expect(res.body.team).toEqual(team);
    });

    it("returns 404 when team is not found by id", async () => {
        db.team.findUnique.mockResolvedValue(null);

        const res = await request(buildApp()).get("/api/team/missing");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Team not found");
    });
});

// ── POST /api/team ────────────────────────────────────────────────────────────
describe("POST /api/team", () => {
    it("returns 201 when team is created successfully", async () => {
        db.team.findUnique.mockResolvedValue(null);
        const created = {
            id: "t1", name: "Alpha", createdBy: "user-1",
            teamLeaderId: "user-1", members: []
        };
        db.team.create.mockResolvedValue(created);

        const res = await request(buildApp())
            .post("/api/team")
            .send({ name: "Alpha", members: [] });

        expect(res.status).toBe(201);
        expect(res.body.team).toEqual(created);
        expect(res.body.message).toBe("Team created successfully");
    });

    it("returns 400 when team name is already taken", async () => {
        db.team.findUnique.mockResolvedValue({ id: "existing" });

        const res = await request(buildApp())
            .post("/api/team")
            .send({ name: "Alpha" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("A team with that name already exists");
    });
});

// ── PUT /api/team/:id ─────────────────────────────────────────────────────────
describe("PUT /api/team/:id", () => {
    it("returns 200 when team is updated", async () => {
        db.team.findUnique.mockResolvedValue({ id: "t1" });
        const updated = { id: "t1", name: "Renamed" };
        db.team.update.mockResolvedValue(updated);

        const res = await request(buildApp())
            .put("/api/team/t1")
            .send({ name: "Renamed" });

        expect(res.status).toBe(200);
        expect(res.body.team).toEqual(updated);
    });

    it("returns 400 when team to update does not exist", async () => {
        db.team.findUnique.mockResolvedValue(null);

        const res = await request(buildApp())
            .put("/api/team/missing")
            .send({ name: "X" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Team not found");
    });
});

// ── DELETE /api/team/:id ──────────────────────────────────────────────────────
describe("DELETE /api/team/:id", () => {
    it("returns 200 when team is deleted", async () => {
        db.team.findUnique.mockResolvedValue({ id: "t1" });
        db.team.delete.mockResolvedValue({ id: "t1" });

        const res = await request(buildApp()).delete("/api/team/t1");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Team deleted successfully");
    });

    it("returns 400 when team to delete does not exist", async () => {
        db.team.findUnique.mockResolvedValue(null);

        const res = await request(buildApp()).delete("/api/team/missing");

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Team not found");
    });
});

// ── POST /api/team/:id/members ────────────────────────────────────────────────
describe("POST /api/team/:id/members", () => {
    it("returns 201 when member is added", async () => {
        db.teamMember.findUnique.mockResolvedValue(null);
        const created = { id: "tm1", teamId: "t1", studentId: "s1" };
        db.teamMember.create.mockResolvedValue(created);

        const res = await request(buildApp())
            .post("/api/team/t1/members")
            .send({ studentId: "s1" });

        expect(res.status).toBe(201);
        expect(res.body.member).toEqual(created);
    });

    it("returns 400 when student is already a member", async () => {
        db.teamMember.findUnique.mockResolvedValue({ id: "existing" });

        const res = await request(buildApp())
            .post("/api/team/t1/members")
            .send({ studentId: "s1" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Student is already a member of this team");
    });
});

// ── DELETE /api/team/:id/members ──────────────────────────────────────────────
describe("DELETE /api/team/:id/members", () => {
    it("returns 200 when member is removed", async () => {
        const existing = { id: "tm1", teamId: "t1", studentId: "s1" };
        db.teamMember.findUnique.mockResolvedValue(existing);
        db.teamMember.delete.mockResolvedValue(existing);

        const res = await request(buildApp())
            .delete("/api/team/t1/members")
            .send({ studentId: "s1" });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Member removed successfully");
    });

    it("returns 400 when member does not exist", async () => {
        db.teamMember.findUnique.mockResolvedValue(null);

        const res = await request(buildApp())
            .delete("/api/team/t1/members")
            .send({ studentId: "s-99" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Team member not found");
    });
});
