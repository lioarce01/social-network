import { inject, injectable } from "tsyringe";
import { ServiceRepository } from "../../../Domain/Repositories/ServiceRepository";
import { Service } from "../../../Domain/Entities/Services";
import { CacheRepository } from "../../../Domain/Repositories/CacheRepository";

@injectable()
export class GetServices
{
    constructor(
        @inject("ServiceRepository") private readonly serviceRepository: ServiceRepository,
        @inject("CacheRepository") private readonly cacheRepository: CacheRepository,
    ) { }

    async execute(offset?: number, limit?: number): Promise<{ data: Service[], totalCount: number }>
    {
        const cacheKey = `services:offset=${offset}&limit=${limit}`
        const cachedServices = await this.cacheRepository.get(cacheKey)

        if (cachedServices) {
            console.log("Cache hit for key:", cacheKey)
            return JSON.parse(cachedServices)
        }

        console.log("Cache miss for key:", cacheKey)
        const result = await this.serviceRepository.getServices(offset, limit)

        await this.cacheRepository.set(cacheKey, JSON.stringify(result), 1800)

        console.log("Data cached for key:", cacheKey)

        return result
    }
}