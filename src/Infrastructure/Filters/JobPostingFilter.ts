import { JobPostingStatus, Prisma } from "@prisma/client";

export interface JobPostingFilters {
  category?: string;
  status?: JobPostingStatus;
}

export interface JobPostingSortOptions {
  sortBy?: "budget";
  sortOrder?: "asc" | "desc";
}

export class JobPostingFilter {
  private filters: JobPostingFilters;
  private sortOptions: JobPostingSortOptions = {};

  constructor(
    filters?: JobPostingFilters,
    sortOptions?: JobPostingSortOptions,
  ) {
    this.filters = filters || {};
    this.sortOptions = sortOptions || {};
  }

  public buildWhereClause(): Prisma.JobPostingWhereInput {
    const whereClause: Prisma.JobPostingWhereInput = {};

    if (this.filters.category) {
      whereClause.category = this.filters.category;
    }

    if (this.filters.status) {
      whereClause.status = this.filters.status;
    }

    return whereClause;
  }

  public buildOrderByClause(): Prisma.JobPostingOrderByWithRelationInput {
    const { sortBy, sortOrder } = this.sortOptions;
    const orderByClause: Prisma.JobPostingOrderByWithRelationInput = {};

    if (sortBy === "budget") {
      orderByClause.budget = sortOrder || "asc";
    }

    return orderByClause;
  }
}
