import { getSocketInstance } from "../../Infrastructure/Websocket/SocketServer";
import { PostRepository } from "../../Domain/Repositories/PostRepository";
import { Post } from "../Entities/Post";
import { GetRecentPosts } from "../../Application/UseCases/Post/GetRecentPosts";
import { CountRecentPosts } from "../../Application/UseCases/Post/CountRecentPosts";

export class PostNotificationService {
  private newPostsCount: number;
  private lastNotificationTime: number;
  private getRecentPostsUseCase: GetRecentPosts;
  private countRecentPostsUseCase: CountRecentPosts;

  constructor(private postRepository: PostRepository) {
    this.newPostsCount = 0;
    this.lastNotificationTime = Date.now();
    this.getRecentPostsUseCase = new GetRecentPosts(postRepository);
    this.countRecentPostsUseCase = new CountRecentPosts(postRepository);
  }

  async addNewPost(post: { content: string; userId: string }): Promise<void> {
    await this.postRepository.createPost(post.userId, {
      content: post.content,
      author: {
        connect: { id: post.userId },
      },
    });

    const { posts: recentPosts } = await this.getRecentPostsUseCase.execute(
      "0",
      1,
    );
    const lastPostId = recentPosts[0]?.id || "0";

    const { posts: newPosts, totalCount } =
      await this.getRecentPostsUseCase.execute(lastPostId, 10);
    this.newPostsCount = totalCount;

    if (
      this.newPostsCount >= 10 ||
      Date.now() - this.lastNotificationTime >= 5 * 60 * 1000
    ) {
      this.notifyClients(newPosts, totalCount);
      this.newPostsCount = 0;
      this.lastNotificationTime = Date.now();
    }
  }

  private notifyClients(newPosts: Post[], totalCount: number): void {
    const io = getSocketInstance();
    io.emit("new-posts", {
      posts: newPosts,
      totalCount,
    });
  }
}
