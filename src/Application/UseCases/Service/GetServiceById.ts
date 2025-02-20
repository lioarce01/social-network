import { inject, injectable } from "tsyringe";
import { ServiceRepository } from "../../../Domain/Repositories/ServiceRepository";
import { Service } from "../../../Domain/Entities/Services";

@injectable()
export class GetServiceById
{
    constructor(
        @inject("ServiceRepository") private readonly serviceRepository: ServiceRepository
    ) { }

    async execute(id: string): Promise<Service | null>
    {
        const result = await this.serviceRepository.getServiceById(id)

        return result
    }
}