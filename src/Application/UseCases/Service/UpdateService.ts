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

    async execute(serviceId: string, serviceData: Partial<Service>): Promise<{ data: Service, message: string }>
    {
        const { data, message } = await this.serviceRepository.updateService(serviceId, serviceData)

        await this.cacheService.invalidateKeys("services:*")

        return {
            data,
            message
        }
    }
}