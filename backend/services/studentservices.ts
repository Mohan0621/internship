import prisma from "../db/prisma.ts";

export default class StudentService {

    async createStudent(userId: string, data: any) {

        const existingStudent =
            await prisma.student.findUnique({
                where: {
                    userId
                }
            });

        if (existingStudent) {
            throw new Error(
                "Student profile already exists"
            );
        }

        const student =
            await prisma.student.create({

                data: {

                    userId,

                    rollNumber: data.rollNumber,

                    department: data.department,

                    collegeName: data.collegeName,

                    cgpa: data.cgpa,

                    githubUrl: data.githubUrl,

                    leetcode: data.leetcode,

                    portfolio: data.portfolio,

                    linkedin: data.linkedin

                }

            });

        return student;

    }

    async getStudent(userId: string) {

        const student =
            await prisma.student.findUnique({

                where: {

                    userId

                }

            });

        if (!student) {

            throw new Error(
                "Student profile not found"
            );

        }

        return student;

    }

    async updateProfile(
        userId: string,
        data: any
    ) {

        const student =
            await prisma.student.update({

                where: {

                    userId

                },

                data: {

                    department: data.department,

                    collegeName: data.collegeName,

                    cgpa: data.cgpa,

                    githubUrl: data.githubUrl,

                    leetcode: data.leetcode,

                    portfolio: data.portfolio,

                    linkedin: data.linkedin

                }

            });

        return student;

    }

}