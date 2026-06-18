import TeamInterface from "../entites/team.js";
import TeamMemberInterface from "../entites/teammember.js";
import prisma from "../db/prisma.js";

export default class TeamService {

    async createTeam(data: TeamInterface) {
        const existing = await prisma.team.findUnique({
            where: { name: data.name }
        });
        if (existing) {
            throw new Error("A team with that name already exists");
        }

        const team = await prisma.team.create({
            data: {
                name: data.name,
                createdBy: data.createdBy,
                teamLeaderId: data.teamLeaderId,
                members: {
                    create: data.members.map((m) => ({
                        studentId: m.studentId
                    }))
                }
            },
            include: { members: true }
        });

        return team;
    }

    async addMember(teamMember: Pick<TeamMemberInterface, "teamId" | "studentId">) {
        const existing = await prisma.teamMember.findUnique({
            where: {
                teamId_studentId: {
                    teamId: teamMember.teamId,
                    studentId: teamMember.studentId
                }
            }
        });
        if (existing) {
            throw new Error("Student is already a member of this team");
        }

        return await prisma.teamMember.create({
            data: {
                teamId: teamMember.teamId,
                studentId: teamMember.studentId
            }
        });
    }

    async removeMember(teamMember: Pick<TeamMemberInterface, "teamId" | "studentId">) {
        const existing = await prisma.teamMember.findUnique({
            where: {
                teamId_studentId: {
                    teamId: teamMember.teamId,
                    studentId: teamMember.studentId
                }
            }
        });
        if (!existing) {
            throw new Error("Team member not found");
        }

        return await prisma.teamMember.delete({
            where: {
                teamId_studentId: {
                    teamId: teamMember.teamId,
                    studentId: teamMember.studentId
                }
            }
        });
    }

    async getTeams() {
        return await prisma.team.findMany({
            include: {
                members: { include: { student: true } },
                teamLeader: true
            }
        });
    }

    async getTeamsByUserId(userId: string) {
        return await prisma.team.findMany({
            where: {
                OR: [
                    { createdBy: userId },
                    { members: { some: { studentId: userId } } }
                ]
            },
            include: {
                members: { include: { student: true } },
                teamLeader: true
            }
        });
    }

    async getTeamById(id: string) {
        const team = await prisma.team.findUnique({
            where: { id },
            include: {
                members: { include: { student: true } },
                teamLeader: true
            }
        });
        if (!team) throw new Error("Team not found");
        return team;
    }

    async getTeamByName(name: string) {
        const team = await prisma.team.findUnique({
            where: { name },
            include: {
                members: { include: { student: true } },
                teamLeader: true
            }
        });
        if (!team) throw new Error("Team not found");
        return team;
    }

    async updateTeam(id: string, data: Partial<Pick<TeamInterface, "name" | "teamLeaderId">>) {
        const existing = await prisma.team.findUnique({ where: { id } });
        if (!existing) throw new Error("Team not found");

        return await prisma.team.update({
            where: { id },
            data,
            include: { members: true, teamLeader: true }
        });
    }

    async deleteTeam(id: string) {
        const existing = await prisma.team.findUnique({ where: { id } });
        if (!existing) throw new Error("Team not found");

        return await prisma.team.delete({ where: { id } });
    }
}
