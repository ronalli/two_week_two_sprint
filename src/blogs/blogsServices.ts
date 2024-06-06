import {blogsRepositories} from "./blogsRepositories";
import {IBlogInputModel} from "./types/blogs-types";

class BlogsServices {
    async createBlog(blog: IBlogInputModel) {
        return await blogsRepositories.create(blog)
    }
    async updateBlog(blogId: string, inputUpdateBlog: IBlogInputModel){
        return await blogsRepositories.update(blogId, inputUpdateBlog);
    }
    async deleteBlog(blogId: string){
        return await blogsRepositories.delete(blogId);
    }
}

export const blogsServices = new BlogsServices();