import StudentService from "../services/studentservices.js";
import { Request, Response } from "express";
import StudentInterface from "../entites/student.js";

export default class StudentController {

    async createStudent(req: Request, res: Response) {

        try {

            const a: StudentInterface = {

                rollNumber: req.body.rollNumber,

                department: req.body.department,

                collegeName: req.body.collegeName,

                phonenumber: req.body.phonenumber,

                year: req.body.year,

                cgpa: req.body.cgpa,

                githubUrl: req.body.githubUrl,

                leetcode: req.body.leetcode,

                portfolio: req.body.portfolio,

                linkedin: req.body.linkedin

            };
            const studentService = new StudentService();

            const user_id: string = req.user.id;

            const student = await studentService.createStudent(

                user_id,

                a

            );

            return res.status(201).json({

                message: "Student created successfully",

                student

            });

        }

        catch (error: any) {

            return res.status(400).json({

                message: error.message

            });

        }

    }

    async updateProfile(req: Request, res: Response) {

        try {

            const a: StudentInterface = {

                rollNumber: req.body.rollNumber,

                department: req.body.department,

                collegeName: req.body.collegeName,

                cgpa: req.body.cgpa,

                githubUrl: req.body.githubUrl,

                leetcode: req.body.leetcode,

                portfolio: req.body.portfolio,

                linkedin: req.body.linkedin

            };

            const studentService = new StudentService();
            const student = await studentService.updateProfile(

                req.user.id,

                a

            );

            return res.status(200).json({

                message: "Profile updated successfully",

                student

            });

        }

        catch (error: any) {

            return res.status(400).json({

                message: error.message

            });

        }

    }

    async getStudent(req: Request, res: Response) {

        try {

            const studentService = new StudentService();
            const student = await studentService.getStudent(

                req.user.id

            );

            return res.status(200).json({

                student

            });

        }

        catch (error: any) {

            return res.status(400).json({

                message: error.message

            });

        }

    }

}