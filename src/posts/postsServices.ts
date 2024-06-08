import {IPostInputModel} from "./types/posts-types";
import {PostsRepositories} from "./postsRepositories";

export class PostsServices {
    constructor(protected postsRepositories: PostsRepositories) {
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