export default interface StudentProfileDTO {
    rollNumber: string;
    department: string;
    collegeName: string;
    cgpa?: number;
    githubUrl?: string;
    leetcode?: string;
    portfolio?: string;
    linkedin?: string;
}