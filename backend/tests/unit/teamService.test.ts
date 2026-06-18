import { describe, it, expect, vi, beforeEach } from "vitest";

// ── mock the Prisma singleton before importing the service ──────────────────
vi.mock("../../db/prisma.js", () => {
    const prismaMock = {
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
    return { default: prismaMock };
});

import prisma from "../../db/prisma.js";
import TeamService from "../../services/teamservices.js";

// cast to get vi.fn() typing
const prismaMock = prisma as any;
const svc = new TeamService();

// helper – reset call history between tests
beforeEach(() => {
    vi.clearAllMocks();
});

// ── createTeam ──────────────────────────────────────────────────────────────
describe("TeamService.createTeam", () => {
    it("creates a team when name is unique", async () => {
        prismaMock.team.findUnique.mockResolvedValue(null);
        const created = {
            id: "team-1",
            name: "Alpha",
            createdBy: "user-1",
            teamLeaderId: "student-1",
            members: [],
        };
        prismaMock.team.create.mockResolvedValue(created);

        const result = await svc.createTeam({
            name: "Alpha",
            createdBy: "user-1",
            teamLeaderId: "student-1",
            members: [],
        });

        expect(prismaMock.team.findUnique).toHaveBeenCalledOnce();
        expect(prismaMock.team.create).toHaveBeenCalledOnce();
        expect(result).toEqual(created);
    });

    it("throws when a team with the same name already exists", async () => {
        prismaMock.team.findUnique.mockResolvedValue({ id: "existing" });

        await expect(
            svc.createTeam({ name: "Alpha", createdBy: "u1", teamLeaderId: "s1", members: [] })
        ).rejects.toThrow("A team with that name already exists");

        expect(prismaMock.team.create).not.toHaveBeenCalled();
    });
});

// ── addMember ───────────────────────────────────────────────────────────────
describe("TeamService.addMember", () => {
    it("adds a member when they are not already on the team", async () => {
        prismaMock.teamMember.findUnique.mockResolvedValue(null);
        const created = { id: "tm-1", teamId: "team-1", studentId: "s-1" };
        prismaMock.teamMember.create.mockResolvedValue(created);

        const result = await svc.addMember({ teamId: "team-1", studentId: "s-1" });

        expect(prismaMock.teamMember.create).toHaveBeenCalledOnce();
        expect(result).toEqual(created);
    });

    it("throws when the student is already on the team", async () => {
        prismaMock.teamMember.findUnique.mockResolvedValue({ id: "existing" });

        await expect(
            svc.addMember({ teamId: "team-1", studentId: "s-1" })
        ).rejects.toThrow("Student is already a member of this team");

        expect(prismaMock.teamMember.create).not.toHaveBeenCalled();
    });
});

// ── removeMember ─────────────────────────────────────────────────────────────
describe("TeamService.removeMember", () => {
    it("removes an existing member", async () => {
        const existing = { id: "tm-1", teamId: "team-1", studentId: "s-1" };
        prismaMock.teamMember.findUnique.mockResolvedValue(existing);
        prismaMock.teamMember.delete.mockResolvedValue(existing);

        const result = await svc.removeMember({ teamId: "team-1", studentId: "s-1" });

        expect(prismaMock.teamMember.delete).toHaveBeenCalledOnce();
        expect(result).toEqual(existing);
    });

    it("throws when the member does not exist", async () => {
        prismaMock.teamMember.findUnique.mockResolvedValue(null);

        await expect(
            svc.removeMember({ teamId: "team-1", studentId: "s-99" })
        ).rejects.toThrow("Team member not found");

        expect(prismaMock.teamMember.delete).not.toHaveBeenCalled();
    });
});

// ── getTeams ─────────────────────────────────────────────────────────────────
describe("TeamService.getTeams", () => {
    it("returns all teams", async () => {
        const teams = [{ id: "t1", name: "Alpha" }, { id: "t2", name: "Beta" }];
        prismaMock.team.findMany.mockResolvedValue(teams);

        const result = await svc.getTeams();

        expect(prismaMock.team.findMany).toHaveBeenCalledOnce();
        expect(result).toEqual(teams);
    });
});

// ── getTeamsByUserId ──────────────────────────────────────────────────────────
describe("TeamService.getTeamsByUserId", () => {
    it("returns teams the user created or is a member of", async () => {
        const teams = [{ id: "t1", createdBy: "user-1" }];
        prismaMock.team.findMany.mockResolvedValue(teams);

        const result = await svc.getTeamsByUserId("user-1");

        expect(prismaMock.team.findMany).toHaveBeenCalledOnce();
        expect(result).toEqual(teams);
    });
});

// ── getTeamById ───────────────────────────────────────────────────────────────
describe("TeamService.getTeamById", () => {
    it("returns a team when found", async () => {
        const team = { id: "t1", name: "Alpha" };
        prismaMock.team.findUnique.mockResolvedValue(team);

        const result = await svc.getTeamById("t1");

        expect(result).toEqual(team);
    });

    it("throws when team is not found", async () => {
        prismaMock.team.findUnique.mockResolvedValue(null);

        await expect(svc.getTeamById("missing")).rejects.toThrow("Team not found");
    });
});

// ── getTeamByName ─────────────────────────────────────────────────────────────
describe("TeamService.getTeamByName", () => {
    it("returns a team when found by name", async () => {
        const team = { id: "t1", name: "Alpha" };
        prismaMock.team.findUnique.mockResolvedValue(team);

        const result = await svc.getTeamByName("Alpha");

        expect(result).toEqual(team);
    });

    it("throws when team is not found by name", async () => {
        prismaMock.team.findUnique.mockResolvedValue(null);

        await expect(svc.getTeamByName("Ghost")).rejects.toThrow("Team not found");
    });
});

// ── updateTeam ────────────────────────────────────────────────────────────────
describe("TeamService.updateTeam", () => {
    it("updates and returns the team", async () => {
        const existing = { id: "t1", name: "Alpha" };
        const updated = { id: "t1", name: "Alpha Renamed" };
        prismaMock.team.findUnique.mockResolvedValue(existing);
        prismaMock.team.update.mockResolvedValue(updated);

        const result = await svc.updateTeam("t1", { name: "Alpha Renamed" });

        expect(prismaMock.team.update).toHaveBeenCalledOnce();
        expect(result).toEqual(updated);
    });

    it("throws when team to update does not exist", async () => {
        prismaMock.team.findUnique.mockResolvedValue(null);

        await expect(svc.updateTeam("missing", { name: "X" })).rejects.toThrow("Team not found");

        expect(prismaMock.team.update).not.toHaveBeenCalled();
    });
});

// ── deleteTeam ────────────────────────────────────────────────────────────────
describe("TeamService.deleteTeam", () => {
    it("deletes an existing team", async () => {
        const existing = { id: "t1" };
        prismaMock.team.findUnique.mockResolvedValue(existing);
        prismaMock.team.delete.mockResolvedValue(existing);

        const result = await svc.deleteTeam("t1");

        expect(prismaMock.team.delete).toHaveBeenCalledOnce();
        expect(result).toEqual(existing);
    });

    it("throws when team to delete does not exist", async () => {
        prismaMock.team.findUnique.mockResolvedValue(null);

        await expect(svc.deleteTeam("missing")).rejects.toThrow("Team not found");

        expect(prismaMock.team.delete).not.toHaveBeenCalled();
    });
});
