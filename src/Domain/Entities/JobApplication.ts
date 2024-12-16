import { JobPosting } from "@prisma/client";
import { User } from "./User";

export class JobApplication {
  constructor(
    public id: string,
    public userId: string,
    public jobPostingId: string,
    public user: User,
    public jobPosting: JobPosting,
    public appliedAt: Date,
  ) {}
}
