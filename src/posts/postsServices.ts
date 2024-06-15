import {IPostInputModel} from "./types/posts-types";
import {PostsRepositories} from "./postsRepositories";
import {inject, injectable} from "inversify";
import {ILikeTypeDB, LikeStatus} from "../types/like.status-type";
import {ResultCode} from "../types/resultCode";

@injectable()
export class PostsServices {
    constructor(@inject(PostsRepositories) protected postsRepositories: PostsRepositories) {
    }

    async createPost(post: IPostInputModel, currentUser: string) {
        return await this.postsRepositories.create(post, currentUser);
    }

    async updatePost(id: string, post: IPostInputModel) {
        return await this.postsRepositories.update(id, post);
    }

    async getPost(id: string, currentUser: string) {
        return await this.postsRepositories.findPostById(id, currentUser)
    }

    async deletePost(id: string) {
        return await this.postsRepositories.delete(id);
    }

    async updateLikeStatus(data: Omit<ILikeTypeDB, 'addedAt'>) {

        const post = await this.postsRepositories.getPost(data.parentId);

        if(!post) {
            return {
                status: ResultCode.BadRequest,
                data: null,
                errorsMessages: [
                    {
                        "message": "Wrong",
                        "field": 'post id'
                    }
                ]
            }
        }

        const searchLike = await this.postsRepositories.getLike(data.parentId, data.userId);

        if(!searchLike) {
            await this.postsRepositories.addStatusLike(data)

            data.status === LikeStatus.Like ? post.likesCount += 1 : post.dislikesCount += 1;

            await post.save();

            return {status: ResultCode.NotContent, data: null}

        }

        return await this.postsRepositories.updateStatusLike(data, post)
    }

}