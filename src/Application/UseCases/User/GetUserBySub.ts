import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserByIdentifier {
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) {}

  async execute(identifier: string): Promise<User | null> {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    return isObjectId
      ? await this.userRepository.getUserById(identifier)
      : await this.userRepository.getUserBySub(identifier);
  }
}
