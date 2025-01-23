import { getSocketInstance } from "../../Infrastructure/Websocket/SocketServer";
import { PostRepository } from "../../Domain/Repositories/PostRepository";
import { Post } from "../Entities/Post";
import { GetRecentPosts } from "../../Application/UseCases/Post/GetRecentPosts";

export class PostNotificationService {
  private newPostsCount: number;
  private lastNotificationTime: number;
  private getRecentPostsUseCase: GetRecentPosts;
  private lastPostDate: Date;

  constructor(private postRepository: PostRepository) {
    this.newPostsCount = 0;
    this.lastNotificationTime = Date.now();
    this.getRecentPostsUseCase = new GetRecentPosts(postRepository);
    this.lastPostDate = new Date();
  }

  async addNewPost(post: { content: string; userId: string }): Promise<void> {
    console.log("Creando nuevo post:", post);
    await this.postRepository.createPost(post.userId, {
      content: post.content,
      author: {
        connect: { id: post.userId },
      },
    });
    console.log("Post creado exitosamente");

    const { posts: newPosts, totalCount } =
      await this.getRecentPostsUseCase.execute(this.lastPostDate, 10);
    console.log("Posts recientes obtenidos:", newPosts);
    console.log("Total de posts recientes:", totalCount);

    console.log("Nuevos posts encontrados:", newPosts);
    console.log("Total de nuevos posts:", totalCount);
    console.log(
      "Última notificación hace:",
      Date.now() - this.lastNotificationTime,
      "ms",
    );
    if (
      this.newPostsCount >= 1 ||
      Date.now() - this.lastNotificationTime >= 5 * 60 * 1000
    ) {
      console.log("Notificando a los clientes...");
      this.notifyClients(newPosts, totalCount);
      this.newPostsCount = 0;
      this.lastNotificationTime = Date.now();
      this.lastPostDate = new Date();
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
