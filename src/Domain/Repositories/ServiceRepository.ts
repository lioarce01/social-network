import { Prisma } from "@prisma/client";
import { Service } from "../Entities/Services";


export interface ServiceRepository
{
    getServices(offset?: number, limit?: number): Promise<{ data: Service[], totalCount: number }>
    getServiceById(id: string): Promise<Service | null>
    createService(authorId: string, serviceData: Prisma.ServiceCreateInput): Promise<Service>
    updateService(authorId: string, serviceId: string, serviceData: Partial<Service>): Promise<Service>
    deleteService(serviceId: string, authorId: string): Promise<{ message: string }>
}