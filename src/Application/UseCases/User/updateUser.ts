import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe";
import { UpdateUserDTO } from "../../DTOs/User";

@injectable()
export class UpdateUser {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: string,
    targetId: string,
    userData: UpdateUserDTO,
  ): Promise<{ message: string; user: User }> {
    const { message, user } = await this.userRepository.updateUser(
      userId,
      targetId,
      userData,
    );

    return { message, user };
  }
}
