import { injectable } from "tsyringe";
import { ServiceRepository } from "../../Domain/Repositories/ServiceRepository";
import { BasePrismaRepository } from "./BasePrismaRepository";
import { Service } from "../../Domain/Entities/Services";
import { Prisma, ServiceStatus } from "@prisma/client";
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

    async createService(authorId: string, serviceData: Prisma.ServiceCreateInput): Promise<Service>
    {
        const author = await this.prisma.user.findUnique({
            where: {
                sub: authorId
            }
        })

        if (!author) {
            throw new CustomError("Author not found", 404)
        }

        const result = await this.prisma.service.create({
            data: {
                ...serviceData,
                author: {
                    connect: { id: author.id }
                }
            }
        })

        return result
    }

    async updateService(authorId: string, serviceId: string, serviceData: Partial<Service>): Promise<Service>
    {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
            include: { author: true }
        })

        if (!service) {
            throw new CustomError("Service not found", 404)
        }

        const user = await this.prisma.user.findUnique({
            where: { sub: authorId }
        })

        if (!user) {
            throw new CustomError("User not found", 404)
        }

        const { author, ...prismaData } = serviceData

        if (user && user.id !== service.authorId) {
            throw new CustomError("You are not authorized to update this service", 403)
        }

        const updatedService = await this.prisma.service.update({
            where: { id: serviceId },
            data: {
                ...prismaData,
                updatedAt: new Date(),
            }
        })

        return updatedService
    }

    async deleteService(serviceId: string, authorId: string): Promise<{ message: string; }>
    {
        const author = await this.prisma.user.findUnique({
            where: { sub: authorId }
        })

        if (!author) {
            throw new CustomError("Author does not exist", 404)
        }

        const service = await this.getById(serviceId)
        if (!service) {
            throw new CustomError("Service does not exist", 404)
        }

        if (author.id !== service.authorId) {
            throw new CustomError("You are not authorized to delete this service", 403)
        }

        await this.prisma.service.delete({
            where: {
                id: serviceId
            }
        })

        return { message: "Service deleted successfully" }
    }

    async switchStatus(serviceId: string, authorId: string): Promise<{ data: Service, message: string; }>
    {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
            include: { author: true }
        })

        if (!service) {
            throw new CustomError("Service not found", 404)
        }

        const user = await this.prisma.user.findUnique({
            where: { sub: authorId }
        })

        if (!user) {
            throw new CustomError("User not found", 404)
        }

        if (user && user.id !== service.authorId) {
            throw new CustomError("You are not authorized to update this service", 403)
        }

        const updatedService = await this.prisma.service.update({
            where: { id: serviceId },
            data: {
                status: service.status === ServiceStatus.OPEN ? ServiceStatus.CLOSED : ServiceStatus.OPEN,
                updatedAt: new Date(),
            }
        })

        return {
            data: updatedService,
            message: `Service status updated to ${updatedService.status} successfully`
        }
    }
}