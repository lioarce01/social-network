import { Prisma } from "@prisma/client";

export interface PostSortOptions {
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
}

export class PostFilter {
  private sortOptions: PostSortOptions = {};

  constructor(sortOptions?: PostSortOptions) {
    this.sortOptions = sortOptions || {};
  }

  public buildOrderByClause(): Prisma.PostOrderByWithRelationInput | undefined {
    const { sortBy, sortOrder } = this.sortOptions;

    if (!sortBy) return undefined;

    const validSortFields: (keyof Prisma.PostOrderByWithRelationInput)[] = [
      "createdAt",
    ];

    if (
      validSortFields.includes(
        sortBy as keyof Prisma.PostOrderByWithRelationInput,
      )
    ) {
      return {
        [sortBy]: sortOrder || "asc",
      } as Prisma.PostOrderByWithRelationInput;
    }

    return undefined;
  }
}
