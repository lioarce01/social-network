import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe";
import { CreateUserDTO } from "../../DTOs/User";

@injectable()
export class CreateUser
{
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) { }

  async execute(
    userData: CreateUserDTO,
  ): Promise<{ message: string; user: User }>
  {
    const { message, user } = await this.userRepository.createUser(userData);

    return { message, user };
  }
}
