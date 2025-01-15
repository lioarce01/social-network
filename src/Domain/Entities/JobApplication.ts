import { JobPosting } from "@prisma/client";
import { User } from "./User";

export class JobApplication {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly jobPostingId: string,
    public readonly appliedAt: Date,
    public readonly isRejected: boolean,
    public readonly user?: User,
    public readonly jobPosting?: JobPosting,
  ) {}
}
