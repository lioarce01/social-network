import { inject, injectable } from "tsyringe";
import { ServiceRepository } from "../../../Domain/Repositories/ServiceRepository";
import { CacheService } from "../../Services/CacheService";
import { Service } from "../../../Domain/Entities/Services";

@injectable()
export class SwitchStatus
{
    constructor(
        @inject("ServiceRepository") private readonly serviceRepository: ServiceRepository,
        @inject("CacheService") private readonly cacheService: CacheService,
    ) { }

    async execute(serviceId: string, userId: string): Promise<{ data: Service, message: string }>
    {
        const { data, message } = await this.serviceRepository.switchStatus(serviceId, userId);

        await this.cacheService.invalidateKeys("services:*")

        return { data, message };
    }
}