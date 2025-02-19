import { inject, injectable } from "tsyringe";
import { ServiceRepository } from "../../../Domain/Repositories/ServiceRepository";
import { Service } from "../../../Domain/Entities/Services";
import { CacheService } from "../../Services/CacheService";

@injectable()
export class UpdateService
{
    constructor(
        @inject("ServiceRepository") private readonly serviceRepository: ServiceRepository,
        @inject("CacheService") private readonly cacheService: CacheService,

    ) { }

    async execute(authorId: string, serviceId: string, serviceData: Partial<Service>): Promise<Service>
    {
        const result = await this.serviceRepository.updateService(authorId, serviceId, serviceData)

        await this.cacheService.invalidateKeys("services:*")

        return result
    }
}