import { injectable } from "tsyringe";
import { ServiceRepository } from "../../Domain/Repositories/ServiceRepository";
import { BasePrismaRepository } from "./BasePrismaRepository";
import { Service } from "../../Domain/Entities/Services";
import { Prisma } from "@prisma/client";
import { CustomError } from "../../Shared/CustomError";

@injectable()
export class PrismaServiceRepository extends BasePrismaRepository<Service> implements ServiceRepository
{
    entityName = "service"

    async getServices(offset: number = 0, limit: number = 10): Promise<{ data: Service[]; totalCount: number; }>
    {
        const pagination = this.buildPagination(offset, limit)

        const result = await this.runTransaction(async (tx) =>
        {
            const services = await tx.service.findMany({
                where: {},
                ...pagination
            })

            const totalCount = await tx.service.count()

            return { services, totalCount }
        })

        return {
            data: result.services,
            totalCount: result.totalCount
        }
    }

    async getServiceById(id: string): Promise<Service | null>
    {
        return await this.getById(id)
    }

    async createService(authorId: string, serviceData: Prisma.ServiceCreateInput): Promise<{ data: Service; message: string; }>
    {
        const author = await this.getBySub(authorId)

        const service = await this.prisma.service.create({
            data: {
                ...serviceData,
                author: {
                    connect: { id: author.id }
                }
            }
        })

        return {
            message: "Service created successfully",
            data: service
        }
    }

    async updateService(serviceId: string, serviceData: Partial<Service>): Promise<{ data: Service; message: string; }>
    {
        throw new Error("Method not implemented.");
    }

    async deleteService(serviceId: string, authorId: string): Promise<{ message: string; }>
    {
        const author = await this.getBySub(authorId)
        if (!author) {
            throw new CustomError("Author does not exist", 404)
        }

        const service = await this.getById(serviceId)
        if (!service) {
            throw new CustomError("Service does not exist", 404)
        }

        if (author.id === service.authorId) {
            await this.prisma.service.delete({
                where: {
                    id: serviceId
                }
            })
        }

        throw new CustomError("You are not authorized to delete this service", 403)
    }
}