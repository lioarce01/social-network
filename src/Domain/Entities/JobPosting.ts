import { JobApplication, JobPostingStatus, Mode } from "@prisma/client";
import { User } from "./User";
import { ExperienceLevel } from "../../types/JobPosting";

export class JobPosting
{
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly budget: number,
    public readonly deadline: Date,
    public readonly techRequired: string[],
    public readonly category: string,
    public readonly status: JobPostingStatus,
    public readonly location: string,
    public readonly mode: Mode,
    public readonly experience_level: ExperienceLevel,
    public readonly jobAuthorId: string,
    public readonly applicants?: JobApplication[],
    public readonly jobAuthor?: User,
  ) { }
}
