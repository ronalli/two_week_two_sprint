import {IPostInputModel} from "./types/posts-types";
import {PostsRepositories} from "./postsRepositories";
import {inject, injectable} from "inversify";

@injectable()
export class PostsServices {
    constructor(@inject(PostsRepositories) protected postsRepositories: PostsRepositories) {
    }

    async createPost(post: IPostInputModel) {
        return await this.postsRepositories.create(post);
    }

    async updatePost(id: string, post: IPostInputModel) {
        return await this.postsRepositories.update(id, post);
    }

    async deletePost(id: string) {
        return await this.postsRepositories.delete(id);
    }

}