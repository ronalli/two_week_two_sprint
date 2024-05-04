import {blogsMongoRepositories} from "./blogsMongoRepositories";
import {IBlogInputModel} from "./types/blogs-types";


export const blogsServices = {
    createBlog: async (blog: IBlogInputModel) => {
        const result = await blogsMongoRepositories.create(blog)
        if (result.data) {
            return {
                status: result.status,
                data: result.data
            }
        }
        return {
            status: result.status,
            errorMessage: result.errorMessage
        }

    },
    updateBlog: async (id: string, inputUpdateBlog: IBlogInputModel) => {
        const result = await blogsMongoRepositories.update(id, inputUpdateBlog);
        if(result.errorMessage) {
            return {
                status: result.status,
                errorMessage: result.errorMessage
            }
        }
        return {
            status: result.status,
            data: null
        }
    },
    deleteBlog: async (id: string) => {
        const result = await blogsMongoRepositories.delete(id);
        if(result.errorMessage) {
            return {
                status: result.status,
                errorMessage: result.errorMessage
            }
        }
        return {
            status: result.status,
            data: null
        }
    }
}