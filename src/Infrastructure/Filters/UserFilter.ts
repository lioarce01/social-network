import { Prisma, Role } from "@prisma/client";

export interface UserFilters {
  role?: Role;
}

export class UserFilter {
  private filters: UserFilters;

  constructor(filters?: UserFilters) {
    this.filters = filters || {};
  }

  public buildWhereClause(): Prisma.UserWhereInput {
    const whereClause: Prisma.UserWhereInput = {};

    if (this.filters.role) {
      whereClause.role = this.filters.role;
    }

    return whereClause;
  }
}
