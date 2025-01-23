import { PostNotificationService } from "../../../Domain/Services/PostNotificationService";
import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class AddPost {
  constructor(
    @inject("PostNotificationService")
    private readonly postNotificationService: PostNotificationService,
  ) {}

  async execute(postData: { content: string; userId: string }): Promise<void> {
    await this.postNotificationService.addNewPost(postData);
  }
}
