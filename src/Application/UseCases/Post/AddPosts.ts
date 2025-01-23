import { PostNotificationService } from "../../../Domain/Services/PostNotificationService";
import { inject, injectable } from "tsyringe";
import { Post } from "../../../Domain/Entities/Post";

@injectable()
export class AddPost {
  constructor(
    @inject("PostNotificationService")
    private readonly postNotificationService: PostNotificationService,
  ) {}

  async execute(post: Post): Promise<void> {
    await this.postNotificationService.addNewPost(post);
  }
}
