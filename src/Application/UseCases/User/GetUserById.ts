import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserById {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<User | null> {
    const user = await this.userRepository.getUserById(id);
    return user;
  }
}
