import JudgeService from "../services/judgeservices.ts";
import { Request, Response } from "express";
import { auth } from "../db/auth.ts"
export default class JudgeController {
    constructor(private judgeService: JudgeService) {

    }

    async createJudge(req: Request, res: Response) {
        try {
            const session =
                await auth.api.getSession({

                    headers: req.headers

                });

            if (!session) {

                return res.status(401)
                    .json({

                        message:
                            "Unauthorized"

                    });

            }
            const judge = await this.judgeService.createJudge(req.body, session.user.id)
            res.json(judge)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }
    async getJudgeProfile(req: Request, res: Response) {
        try {
            const session =
                await auth.api.getSession({

                    headers: req.headers

                });

            if (!session) {

                return res.status(401)
                    .json({

                        message:
                            "Unauthorized"

                    });

            }
            const judge = await this.judgeService.getJudgeById(session.user.id)
            res.json(judge)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }
    async updateJudge(req: Request, res: Response) {
        try {
            const session =
                await auth.api.getSession({

                    headers: req.headers

                });

            if (!session) {

                return res.status(401)
                    .json({

                        message:
                            "Unauthorized"

                    });

            }
            const judge = await this.judgeService.updateJudge(req.body, session.user.id)
            res.json(judge)
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }
}   