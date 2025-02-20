import { ServiceStatus } from "@prisma/client";
import { User } from "./User";

export class Service
{
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly description: string,
        public readonly skills: string[],
        public readonly price: number,
        public readonly status: ServiceStatus,
        public readonly authorId: string,
        public readonly author?: User
    ) { }
}