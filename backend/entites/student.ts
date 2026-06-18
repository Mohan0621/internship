export default interface StudentProfileDTO {
    rollNumber: string;
    department: string;
    collegeName: string;
    phonenumber: number;
    year: number;
    cgpa?: number;
    githubUrl?: string;
    leetcode?: string;
    portfolio?: string;
    linkedin?: string;
}