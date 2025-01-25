import { getSocketInstance } from "../../Infrastructure/Websocket/SocketServer";
import { PostRepository } from "../../Domain/Repositories/PostRepository";
import { Post } from "../Entities/Post";
import { GetRecentPosts } from "../../Application/UseCases/Post/GetRecentPosts";
import { inject, injectable } from "tsyringe";

@injectable()
export class PostNotificationService {
  private newPostsCount: number;
  private lastNotificationTime: number;
  private getRecentPostsUseCase: GetRecentPosts;
  private lastPostDate: Date;

  constructor(
    @inject("PostRepository") private postRepository: PostRepository,
  ) {
    this.newPostsCount = 0;
    this.lastNotificationTime = Date.now();
    this.getRecentPostsUseCase = new GetRecentPosts(postRepository);
    this.lastPostDate = new Date();
  }

  async addNewPost(post: Post): Promise<void> {
    this.newPostsCount += 1;

    const { posts: newPosts, totalCount } =
      await this.getRecentPostsUseCase.execute(this.lastPostDate, 10);

    if (newPosts.length > 0) {
      if (
        this.newPostsCount >= 1 ||
        Date.now() - this.lastNotificationTime >= 5 * 60 * 1000
      ) {
        this.notifyClients(newPosts, totalCount);
        this.newPostsCount = 0;
        this.lastNotificationTime = Date.now();
        this.lastPostDate = new Date();
      }
    } else {
      console.log("No hay nuevos posts para notificar");
    }
  }

  private notifyClients(newPosts: Post[], totalCount: number): void {
    console.log("Emitting 'new-posts' event with data:", {
      newPosts,
      totalCount,
    });
    const io = getSocketInstance();
    io.emit("new-posts", {
      posts: newPosts,
      totalCount,
    });
  }
}
