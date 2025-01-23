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

  async addNewPost(post: { content: string; userId: string }): Promise<void> {
    console.log("Creando nuevo post:", post);
    await this.postRepository.createPost(post.userId, {
      content: post.content,
      author: {
        connect: { id: post.userId },
      },
    });
    console.log("Post creado exitosamente");

    // Incrementar el contador de nuevos posts
    this.newPostsCount += 1;

    // Obtener los posts recientes
    const { posts: newPosts, totalCount } =
      await this.getRecentPostsUseCase.execute(this.lastPostDate, 10);
    console.log("Posts recientes obtenidos:", newPosts);
    console.log("Total de posts recientes:", totalCount);

    // Verificar si hay nuevos posts antes de notificar
    if (newPosts.length > 0) {
      console.log("Nuevos posts encontrados:", newPosts);
      console.log("Total de nuevos posts:", totalCount);
      console.log(
        "Última notificación hace:",
        Date.now() - this.lastNotificationTime,
        "ms",
      );

      // Notificar a los clientes si se cumple la condición
      if (
        this.newPostsCount >= 1 ||
        Date.now() - this.lastNotificationTime >= 5 * 60 * 1000
      ) {
        console.log("Notificando a los clientes...");
        this.notifyClients(newPosts, totalCount);
        this.newPostsCount = 0; // Reiniciar el contador
        this.lastNotificationTime = Date.now(); // Actualizar el tiempo de la última notificación
        this.lastPostDate = new Date(); // Actualizar la fecha del último post
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
