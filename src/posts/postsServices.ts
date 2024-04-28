import {IPostInputModel} from "./types/posts-types";
import {postsMongoRepositories} from "./postsMongoRepositories";

export const postsServices = {
    createPost: async (post: IPostInputModel) => {
        return await postsMongoRepositories.create(post);
    },
    updatePost: async (id: string, post: IPostInputModel) => {
        return await postsMongoRepositories.update(id, post);
    },
    deletePost: async (id: string) => {
        return await postsMongoRepositories.delete(id);
    }
}