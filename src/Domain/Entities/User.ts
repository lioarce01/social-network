import { Comment, Post, Role } from "@prisma/client";

export class User {
  constructor(
    public id: string,
    public sub: string,
    public name: string,
    public email: string,
    public enabled: boolean,
    public role: Role,
    public createdAt: Date,
    public updatedAt: Date,
    public posts?: Post[],
    public comments?: Comment[],
  ) {}
}
