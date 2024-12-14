import { PostLike } from "../Entities/PostLike";

export interface PostLikeRepository {
  likePost(
    userId: string,
    postId: string,
  ): Promise<{ message: string; postLike: PostLike }>;
  unlikePost(userId: string, postId: string): Promise<{ message: string }>;
}
