import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserBySub {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(sub: string): Promise<User | null> {
    const user = await this.userRepository.getUserBySub(sub);
    return user;
  }
}
