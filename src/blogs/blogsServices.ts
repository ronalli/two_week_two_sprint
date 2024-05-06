import {blogsMongoRepositories} from "./blogsMongoRepositories";
import {IBlogInputModel} from "./types/blogs-types";

export const blogsServices = {
    createBlog: async (blog: IBlogInputModel) => {
        return await blogsMongoRepositories.create(blog)
    },
    updateBlog: async (blogId: string, inputUpdateBlog: IBlogInputModel) => {
        return await blogsMongoRepositories.update(blogId, inputUpdateBlog);
    },
    deleteBlog: async (blogId: string) => {
        return await blogsMongoRepositories.delete(blogId);
    }
}