import { JobApplication } from "@prisma/client";
import { User } from "./User";

export class JobPosting {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public budget: number,
    public deadline: Date,
    public techRequired: String[],
    public category: string,
    public status: string,
    public jobAuthorId: string,
    public applicants?: JobApplication[],
    public jobAuthor?: User,
  ) {}
}
