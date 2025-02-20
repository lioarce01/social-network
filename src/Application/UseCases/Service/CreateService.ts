import { inject, injectable } from "tsyringe";
import { ServiceRepository } from "../../../Domain/Repositories/ServiceRepository";
import { Prisma } from "@prisma/client";
import { Service } from "../../../Domain/Entities/Services";
import { CacheService } from "../../Services/CacheService";

@injectable()
export class CreateService
{
    constructor(
        @inject("ServiceRepository") private readonly serviceRepository: ServiceRepository,
        @inject("CacheService") private readonly cacheService: CacheService,
    ) { }

    async execute(authorId: string, serviceData: Prisma.ServiceCreateInput): Promise<Service>
    {
        const result = await this.serviceRepository.createService(authorId, serviceData)

        await this.cacheService.invalidateKeys("services:*")

        return result
    }

}