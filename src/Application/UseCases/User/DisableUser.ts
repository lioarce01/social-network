import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe";

@injectable()
export class DisableUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, adminId: string): Promise<{ message: string }> {
    const { message } = await this.userRepository.disableUser(id, adminId);

    return { message };
  }
}
