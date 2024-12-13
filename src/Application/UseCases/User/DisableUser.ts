import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe";

@injectable()
export class DisableUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<{ message: string; user: User }> {
    const { message, user } = await this.userRepository.disableUser(id);

    return { message, user };
  }
}
