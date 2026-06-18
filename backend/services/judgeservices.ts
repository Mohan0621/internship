import prisma from "../db/prisma.js";
import JudgeInterface from "../entites/judge.js";

export default class JudgeService {
    async createJudge(judge: JudgeInterface, userId: string) {
        const check = await prisma.judge.findUnique({
            where: {
                userId: userId
            }
        });
        if (check) {
            throw new Error("Judge already exists")
        }
        return await prisma.judge.create({
            data: {
                ...judge,
                userId: userId
            }
        });
    }

    async getJudgeById(id: string) {
        return await prisma.judge.findUnique({
            where: {
                id: id
            }
        });
    }
    async updateJudge(judge: JudgeInterface, userId: string) {
        return await prisma.judge.update({
            where: {
                userId: userId
            },
            data: judge
        });
    }
}