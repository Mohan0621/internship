import TeamService from "../services/teamservices.js";
import { Request, Response } from "express";

export default class TeamController {
    private teamService: TeamService;

    constructor() {
        this.teamService = new TeamService();
        // bind all methods so they work correctly as route handlers
        this.createTeam = this.createTeam.bind(this);
        this.addMember = this.addMember.bind(this);
        this.removeMember = this.removeMember.bind(this);
        this.getTeams = this.getTeams.bind(this);
        this.getMyTeams = this.getMyTeams.bind(this);
        this.getTeamById = this.getTeamById.bind(this);
        this.getTeamByName = this.getTeamByName.bind(this);
        this.updateTeam = this.updateTeam.bind(this);
        this.deleteTeam = this.deleteTeam.bind(this);
    }

    async createTeam(req: Request, res: Response) {
        try {
            const userId: string = req.user.id;
            const team = await this.teamService.createTeam({
                name: req.body.name,
                createdBy: userId,
                teamLeaderId: req.body.teamLeaderId ?? userId,
                members: (req.body.members ?? []).map((m: any) => ({
                    studentId: m.studentId
                }))
            });
            return res.status(201).json({ message: "Team created successfully", team });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async addMember(req: Request, res: Response) {
        try {
            const member = await this.teamService.addMember({
                teamId: req.params.id,
                studentId: req.body.studentId
            });
            return res.status(201).json({ message: "Member added successfully", member });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async removeMember(req: Request, res: Response) {
        try {
            await this.teamService.removeMember({
                teamId: req.params.id,
                studentId: req.body.studentId
            });
            return res.status(200).json({ message: "Member removed successfully" });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async getTeams(req: Request, res: Response) {
        try {
            const teams = await this.teamService.getTeams();
            return res.status(200).json({ teams });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getMyTeams(req: Request, res: Response) {
        try {
            const userId: string = req.user.id;
            const teams = await this.teamService.getTeamsByUserId(userId);
            return res.status(200).json({ teams });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getTeamById(req: Request, res: Response) {
        try {
            const team = await this.teamService.getTeamById(req.params.id);
            return res.status(200).json({ team });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    async getTeamByName(req: Request, res: Response) {
        try {
            const team = await this.teamService.getTeamByName(req.params.name);
            return res.status(200).json({ team });
        } catch (error: any) {
            return res.status(404).json({ message: error.message });
        }
    }

    async updateTeam(req: Request, res: Response) {
        try {
            const team = await this.teamService.updateTeam(req.params.id, {
                name: req.body.name,
                teamLeaderId: req.body.teamLeaderId
            });
            return res.status(200).json({ message: "Team updated successfully", team });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }

    async deleteTeam(req: Request, res: Response) {
        try {
            await this.teamService.deleteTeam(req.params.id);
            return res.status(200).json({ message: "Team deleted successfully" });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    }
}
