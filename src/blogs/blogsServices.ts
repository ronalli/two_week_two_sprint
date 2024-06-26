import {BlogsRepositories} from "./blogsRepositories";
import {IBlogInputModel} from "./types/blogs-types";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsServices {
    constructor(@inject(BlogsRepositories) protected blogsRepositories: BlogsRepositories) {
    }

    async createBlog(blog: IBlogInputModel) {
        return await this.blogsRepositories.create(blog)
    }
    async updateBlog(blogId: string, inputUpdateBlog: IBlogInputModel){
        return await this.blogsRepositories.update(blogId, inputUpdateBlog);
    }
    async deleteBlog(blogId: string){
        return await this.blogsRepositories.delete(blogId);
    }
}
