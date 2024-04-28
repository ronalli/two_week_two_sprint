import {blogsMongoRepositories} from "./blogsMongoRepositories";
import {IBlogInputModel} from "./types/blogs-types";


export const blogsServices = {
    createBlog: async(blog: IBlogInputModel)=> {
        return await blogsMongoRepositories.create(blog)
    },
    updateBlog: async (id: string, inputUpdateBlog: IBlogInputModel) => {
        return await blogsMongoRepositories.update(id, inputUpdateBlog);
    },
    deleteBlog: async (id: string) => {
        return await blogsMongoRepositories.delete(id);
    }
}