import { JobPostingStatus, Mode, Prisma } from "@prisma/client";

export interface JobPostingFilters
{
  category?: string;
  status?: JobPostingStatus;
  searchTerm?: string;
  mode?: Mode;
}

export interface JobPostingSortOptions
{
  sortBy?: "budget" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export class JobPostingFilter
{
  private filters: JobPostingFilters;
  private sortOptions: JobPostingSortOptions = {};

  constructor(
    filters?: JobPostingFilters,
    sortOptions?: JobPostingSortOptions,
  )
  {
    this.filters = filters || {};
    this.sortOptions = sortOptions || {};
  }

  public buildWhereClause(): Prisma.JobPostingWhereInput
  {
    const whereClause: Prisma.JobPostingWhereInput = {};

    if (this.filters.category) {
      whereClause.category = this.filters.category;
    }

    if (this.filters.status) {
      whereClause.status = this.filters.status;
    }

    if (this.filters.searchTerm) {
      whereClause.OR = [
        { title: { contains: this.filters.searchTerm, mode: "insensitive" } },
        {
          description: {
            contains: this.filters.searchTerm,
            mode: "insensitive",
          },
        },
      ];
    }

    if (this.filters.mode) {
      whereClause.mode = this.filters.mode;
    }

    return whereClause;
  }

  public buildOrderByClause():
    | Prisma.JobPostingOrderByWithRelationInput
    | undefined
  {
    const { sortBy, sortOrder } = this.sortOptions;

    if (!sortBy) return undefined;

    const validSortFields: (keyof Prisma.JobPostingOrderByWithRelationInput)[] =
      ["budget", "createdAt"];

    if (
      validSortFields.includes(
        sortBy as keyof Prisma.JobPostingOrderByWithRelationInput,
      )
    ) {
      return {
        [sortBy]: sortOrder || "asc",
      } as Prisma.JobPostingOrderByWithRelationInput;
    }

    return undefined;
  }
}
