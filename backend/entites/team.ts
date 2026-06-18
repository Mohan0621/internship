import TeamMemberInterface from "./teammember.js";

export default interface TeamInterface {
    name: string;
    teamLeaderId: string;
    createdBy: string;
    members: Pick<TeamMemberInterface, "studentId">[];
}
