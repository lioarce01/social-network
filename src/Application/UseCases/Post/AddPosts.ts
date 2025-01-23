import { PostNotificationService } from "../../../Domain/Services/PostNotificationService";
import { PostRepository } from "../../../Domain/Repositories/PostRepository";
import { inject } from "tsyringe";

export class AddPostUseCase {
  private postNotificationService: PostNotificationService;

  constructor(
    @inject("PostRepository") private readonly postRepository: PostRepository,
  ) {
    this.postNotificationService = new PostNotificationService(postRepository);
  }

  async execute(postData: { content: string; userId: string }): Promise<void> {
    await this.postNotificationService.addNewPost(postData);
  }
}
