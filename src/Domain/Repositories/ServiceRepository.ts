import { Prisma } from "@prisma/client";
import { Service } from "../Entities/Services";


export interface ServiceRepository
{
    getServices(offset?: number, limit?: number): Promise<{ data: Service[], totalCount: number }>
    getServiceById(id: string): Promise<Service | null>
    createService(serviceData: Prisma.ServiceCreateInput): Promise<{ data: Service, message: string }>
    updateService(serviceId: string, serviceData: Partial<Service>): Promise<{ data: Service, message: string }>
    deleteService(serviceId: string, authorId: string): Promise<{ message: string }>
}