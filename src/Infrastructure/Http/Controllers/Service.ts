import { inject, injectable } from "tsyringe";
import { GetServices } from "../../../Application/UseCases/Service/GetServices";
import { GetServiceById } from "../../../Application/UseCases/Service/GetServiceById";
import { CreateService } from "../../../Application/UseCases/Service/CreateService";
import { UpdateService } from "../../../Application/UseCases/Service/UpdateService";
import { DeleteService } from "../../../Application/UseCases/Service/DeleteService";
import { NextFunction, request, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { SwitchStatus } from "../../../Application/UseCases/Service/SwitchStatus";


@injectable()
export class ServiceController
{
    constructor(
        @inject("GetServices") private getServicesUseCase: GetServices,
        @inject("GetServiceById") private getServiceByIdUseCase: GetServiceById,
        @inject("CreateService") private createServiceUseCase: CreateService,
        @inject("UpdateService") private updateServiceUseCase: UpdateService,
        @inject("DeleteService") private deleteServiceUseCase: DeleteService,
        @inject("SwitchStatus") private switchStatusUseCase: SwitchStatus
    ) { }

    async getServices(req: Request, res: Response, next: NextFunction)
    {
        try {
            const { sortBy, sortOrder, searchTerm } = req.query
            const offset = parseInt(req.query.offset as string) || 0;
            const limit = parseInt(req.query.limit as string) || 10;

            const filters = {
                searchTerm: searchTerm as string
            }

            const sortOptions = {
                sortBy: sortBy as "price" | "createdAt",
                sortOrder: sortOrder as "asc" | "desc",
            };

            const { data, totalCount } = await this.getServicesUseCase.execute(filters, sortOptions, offset, limit)

            return res.status(200).json({
                code: 200,
                status: "SUCCESS",
                data,
                totalCount
            })
        } catch (e) {
            next(e)
        }
    }

    async getServiceById(req: Request, res: Response, next: NextFunction)
    {
        try {
            const { id } = req.params

            const data = await this.getServiceByIdUseCase.execute(id)

            return res.status(200).json({
                code: 200,
                status: 'SUCCESS',
                data
            })
        } catch (e) {
            next(e)
        }
    }

    async createService(req: Request, res: Response, next: NextFunction)
    {
        try {
            const {
                title,
                description,
                skills,
                price,
            } = req.body

            const userId = req.auth!.sub

            if (!userId) {
                return res.status(401).json({
                    code: 401,
                    status: "UNAUTHORIZED",
                    message: "Unauthorized"
                })
            }

            const serviceData: Prisma.ServiceCreateInput = {
                title,
                description,
                skills,
                price,
                author: {
                    connect: {
                        sub: userId
                    }
                }
            }

            const data = await this.createServiceUseCase.execute(userId, serviceData)

            return res.status(201).json({
                code: 201,
                status: "SUCCESS",
                data
            })
        } catch (e) {
            next(e)
        }
    }
    async updateService(req: Request, res: Response, next: NextFunction)
    {
        try {
            const updates = { ...req.body }
            const { id } = req.params
            const userId = req.auth!.sub

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({
                    code: 400,
                    status: "BAD_REQUEST",
                    message: "Missing required fields",
                });
            }

            const data = await this.updateServiceUseCase.execute(userId!, id, updates)

            return res.status(200).json({
                code: 200,
                status: "SUCCESS",
                data
            })
        } catch (e) {
            next(e)
        }
    }

    async deleteService(req: Request, res: Response, next: NextFunction)
    {
        try {
            const { id } = req.params
            const userId = req.auth!.sub

            const { message } = await this.deleteServiceUseCase.execute(id, userId)

            if (!id) {
                return res.status(400).json({
                    code: 400,
                    status: "BAD_REQUEST",
                    message: "Missing required fields",
                });
            }

            return res.status(200).json({
                code: 200,
                status: "SUCCESS",
                message: message,
            });

        } catch (e) {
            next(e)
        }
    }

    async switchStatus(req: Request, res: Response, next: NextFunction)
    {
        try {
            const { id } = req.params
            const userId = req.auth!.sub

            const { data, message } = await this.switchStatusUseCase.execute(id, userId)

            if (!id) {
                return res.status(400).json({
                    code: 400,
                    status: "BAD_REQUEST",
                    message: "Missing required fields",
                });
            }

            return res.status(200).json({
                code: 200,
                status: "SUCCESS",
                data,
                message: message,
            });
        } catch (e) {
            next(e)
        }
    }
}