import { Prisma } from "@prisma/client";
import { Service } from "../Entities/Services";
import { ServiceFilter } from "../../Infrastructure/Filters/ServiceFilter";


export interface ServiceRepository
{
    getServices(filter?: ServiceFilter, offset?: number, limit?: number): Promise<{ data: Service[], totalCount: number }>
    getServiceById(id: string): Promise<Service | null>
    createService(authorId: string, serviceData: Prisma.ServiceCreateInput): Promise<Service>
    updateService(authorId: string, serviceId: string, serviceData: Partial<Service>): Promise<Service>
    deleteService(serviceId: string, authorId: string): Promise<{ message: string }>
    switchStatus(serviceId: string, authorId: string): Promise<{ data: Service, message: string }>
}