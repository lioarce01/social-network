import { Prisma, PrismaClient } from "@prisma/client";
import { CustomError } from "../../Shared/CustomError";
import { prisma } from "../../config/config";

export abstract class BasePrismaRepository<T> {
  protected prisma: PrismaClient = prisma;
  protected abstract entityName: string;

  protected handleNotFound(entityId: string, entity?: any): void {
    if (!entity) {
      throw new CustomError(
        `${this.entityName} with ID ${entityId} not found`,
        404,
      );
    }
  }

  protected async getById(
    id: string,
    include?: Prisma.UserInclude,
  ): Promise<any> {
    const entity = await (this.prisma as any)[this.entityName].findUnique({
      where: { id },
      include,
    });
    this.handleNotFound(id, entity);
    return entity;
  }

  protected async getBySub(
    sub: string,
    include?: Prisma.UserInclude,
  ): Promise<any> {
    const entity = await (this.prisma as any).user.findUnique({
      where: { sub },
      include,
    });
    this.handleNotFound(sub, entity);
    return entity;
  }

  protected async baseUpdate(
    id: string,
    data: Partial<Prisma.UserUpdateInput>,
    include?: Prisma.UserInclude,
  ): Promise<any> {
    await this.getById(id);
    return (this.prisma as any)[this.entityName].update({
      where: { id },
      data,
      include,
    });
  }

  protected async baseDelete(id: string): Promise<void> {
    await (this.prisma as any)[this.entityName].delete({ where: { id } });
  }

  protected buildPagination(
    offset: number = 0,
    limit: number = 10,
  ): { skip: number; take: number } {
    return {
      skip: offset,
      take: limit,
    };
  }

  protected async runTransaction<T>(
    fn: (prisma: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
