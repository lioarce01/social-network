import { Prisma } from "@prisma/client"


export interface ServiceFilters
{
    searchTerm?: string
}

export interface ServiceSortOptions
{
    sortBy?: "price" | "createdAt"
    sortOrder?: "asc" | "desc"
}

export class ServiceFilter
{
    private filters: ServiceFilters
    private sortOptions: ServiceSortOptions = {}

    constructor(filters?: ServiceFilters, sortOptions?: ServiceSortOptions)
    {
        this.filters = filters || {}
        this.sortOptions = sortOptions || {}
    }

    public buildWhereClause(): any
    {
        const whereClause: any = {}

        if (this.filters.searchTerm) {
            whereClause.OR = [
                { title: { contains: this.filters.searchTerm, mode: "insensitive" } },
                { description: { contains: this.filters.searchTerm, mode: "insensitive" } },
            ]
        }

        return whereClause
    }

    public buildOrderByClause():
        | Prisma.ServiceOrderByWithRelationInput
        | undefined
    {
        const { sortBy, sortOrder } = this.sortOptions

        const validSortFields: (keyof Prisma.ServiceOrderByWithRelationInput)[] =
            ["price", "createdAt"];

        if (
            validSortFields.includes(
                sortBy as keyof Prisma.ServiceOrderByWithRelationInput,
            )
        ) {
            return {
                [sortBy as string]: sortOrder || "asc",
            } as Prisma.ServiceOrderByWithRelationInput;
        }

        return undefined;
    }
}
