import { inject, injectable } from "tsyringe";
import { ServiceRepository } from "../../../Domain/Repositories/ServiceRepository";
import { CacheService } from "../../Services/CacheService";


@injectable()
export class DeleteService
{
    constructor(
        @inject("ServiceRepository") private readonly serviceRepository: ServiceRepository,
        @inject("CacheService") private readonly cacheService: CacheService,
    ) { }

    async execute(serviceId: string, authorId: string): Promise<{ message: string }>
    {
        const { message } = await this.serviceRepository.deleteService(serviceId, authorId)

        await this.cacheService.invalidateKeys("services:*")

        return {
            message
        }
    }
}