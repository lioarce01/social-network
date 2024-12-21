import { JobApplication, JobPostingStatus } from "@prisma/client";
import { User } from "./User";

export class JobPosting {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly budget: number,
    public readonly deadline: Date,
    public readonly techRequired: string[],
    public readonly category: string,
    public readonly status: JobPostingStatus,
    public readonly jobAuthorId: string,
    public readonly applicants?: JobApplication[],
    public readonly jobAuthor?: User,
  ) {}
}
