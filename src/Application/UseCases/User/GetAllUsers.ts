import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe";
import {
  UserFilter,
  UserFilters,
} from "../../../Infrastructure/Filters/UserFilter";

@injectable()
export class GetAllUsers {
  constructor(
    @inject("UserRepository")
    private userRepository: UserRepository,
  ) {}

  async execute(
    filters?: UserFilters,
    offset?: number,
    limit?: number,
  ): Promise<User[] | null> {
    const filter = new UserFilter(filters);
    const users = await this.userRepository.getAllUsers(filter, offset, limit);

    return users;
  }
}
