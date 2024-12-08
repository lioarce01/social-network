import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe";

@injectable()
export class UpdateUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(
    id: string,
    userData: Partial<User>,
  ): Promise<{ message: string; user: User }> {
    const { message, user } = await this.userRepository.updateUser(
      id,
      userData,
    );

    return { message, user };
  }
}
