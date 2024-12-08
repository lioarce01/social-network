import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe";

@injectable()
export class createUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userData: Partial<User>,
  ): Promise<{ message: string; user: User }> {
    const { message, user } = await this.userRepository.createUser(userData);

    return { message, user };
  }
}
