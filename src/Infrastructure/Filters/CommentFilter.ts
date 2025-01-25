import { Prisma } from "@prisma/client";

export interface CommentSortOptions {
  sortBy?: "createdAt";
  sortOrder?: "asc" | "desc";
}

export class CommentFilter {
  private sortOptions: CommentSortOptions = {};
  constructor(sortOptions?: CommentSortOptions) {
    this.sortOptions = sortOptions || {};
  }

  public buildOrderByClause():
    | Prisma.CommentOrderByWithRelationInput
    | undefined {
    const { sortBy, sortOrder } = this.sortOptions;

    if (!sortBy) return undefined;

    const validSortFields: (keyof Prisma.CommentOrderByWithRelationInput)[] = [
      "createdAt",
    ];

    if (
      validSortFields.includes(
        sortBy as keyof Prisma.CommentOrderByWithRelationInput,
      )
    ) {
      return {
        [sortBy]: sortOrder || "asc",
      } as Prisma.CommentOrderByWithRelationInput;
    }
    return undefined;
  }
}
