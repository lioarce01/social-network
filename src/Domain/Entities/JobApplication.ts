import { JobPosting } from "@prisma/client";
import { User } from "./User";

export class JobApplication {
  constructor(
    public id: string,
    public userId: string,
    public jobPostingId: string,
    public appliedAt: Date,
    public user?: User,
    public jobPosting?: JobPosting,
  ) {}
}
