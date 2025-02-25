import { inject, injectable } from "tsyringe";
import { ServiceRepository } from "../../../Domain/Repositories/ServiceRepository";
import { Service } from "../../../Domain/Entities/Services";
import { CacheRepository } from "../../../Domain/Repositories/CacheRepository";
import { ServiceFilter, ServiceFilters, ServiceSortOptions } from "../../../Infrastructure/Filters/ServiceFilter";

@injectable()
export class GetServices
{
    constructor(
        @inject("ServiceRepository") private readonly serviceRepository: ServiceRepository,
        @inject("CacheRepository") private readonly cacheRepository: CacheRepository,
    ) { }

    async execute(filters?: ServiceFilters, sortOptions?: ServiceSortOptions, offset?: number, limit?: number): Promise<{ data: Service[], totalCount: number }>
    {
        const cacheKey = `services:offset=${offset}&limit=${limit}&sortBy=${sortOptions?.sortBy}&sortOrder=${sortOptions?.sortOrder}&searchTerm=${filters?.searchTerm}`;
        const cachedServices = await this.cacheRepository.get(cacheKey)

        if (cachedServices) {
            console.log("Cache hit for key:", cacheKey)
            return JSON.parse(cachedServices)
        }

        console.log("Cache miss for key:", cacheKey)
        const filter = new ServiceFilter(filters, sortOptions)
        const result = await this.serviceRepository.getServices(filter, offset, limit)

        await this.cacheRepository.set(cacheKey, JSON.stringify(result), 1800)

        console.log("Data cached for key:", cacheKey)

        return result
    }
}