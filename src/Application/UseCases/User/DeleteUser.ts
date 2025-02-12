import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class DeleteUser
{
  constructor(
    @inject("UserRepository") private readonly userRepository: UserRepository,
  ) { }

  async execute(
    targetId: string,
  ): Promise<{ message: string }>
  {
    const { message } = await this.userRepository.deleteUser(targetId);

    return { message };
  }
}
