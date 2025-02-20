import { UserRepository } from "../../../Domain/Repositories/UserRepository";
import { User } from "../../../Domain/Entities/User";
import { inject, injectable } from "tsyringe"

@injectable()
export class GetMe
{
    constructor(
        @inject("UserRepository") private userRepository: UserRepository
    ) { }

    async execute(id: string): Promise<User | null>
    {
        const user = await this.userRepository.getMe(id)

        return user
    }
}