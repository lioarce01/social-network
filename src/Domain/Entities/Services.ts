import { User } from "./User";

export class JobPosting
{
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly skills: string[],
        public readonly authorId: string,
        public readonly author?: User
    ) { }
}