import {Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {BlogsQueryRepositories} from "./blogsQueryRepositories";
import {BlogsServices} from "./blogsServices";
import {IBlogInputModel} from "./types/blogs-types";
import {IBlogQueryType} from "./types/request-response-type";
import {PostsServices} from "../posts/postsServices";

export class BlogsController {
    private blogsServices: BlogsServices
    private blogsQueryRepositories: BlogsQueryRepositories
    private postsServices: PostsServices

    constructor() {
        this.blogsServices = new BlogsServices();
        this.blogsQueryRepositories = new BlogsQueryRepositories();
        this.postsServices = new PostsServices();
    }

    async createBlog(req: Request, res: Response) {
        const inputDataBlog: IBlogInputModel = req.body;
        const result = await this.blogsServices.createBlog(inputDataBlog);
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return;
        }
        res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
    }

    async getBlog(req: Request, res: Response) {
        const {blogId} = req.params;
        const result = await this.blogsQueryRepositories.findBlogById(blogId);
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
        return
    }

    async getBlogs(req: Request, res: Response) {
        const queryParams: IBlogQueryType = req.query;
        const result = await this.blogsQueryRepositories.getAllBlogs(queryParams);

        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }

        res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
        return
    }

    async updateBlog(req: Request, res: Response) {
        const {blogId} = req.params;
        const inputUpdateDataBlog: IBlogInputModel = req.body;
        const result = await this.blogsServices.updateBlog(blogId, inputUpdateDataBlog)
        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send(result.data)
        return
    }

    async deleteBlog(req: Request, res: Response) {
        const {blogId} = req.params;
        const result = await this.blogsServices.deleteBlog(blogId);
        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send(result.data)
        return
    }

    async getAllPostsForBlog(req: Request, res: Response) {
        const {blogId} = req.params;
        const queryParams: IBlogQueryType = req.query;

        const result = await this.blogsQueryRepositories.findBlogById(blogId);
        if (result.data) {
            const foundPosts = await this.blogsQueryRepositories.getAndSortPostsSpecialBlog(blogId, queryParams)
            res.status(HTTP_STATUSES[foundPosts.status]).send(foundPosts.data)
            return
        }

        res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
        return
    }

    async createPostForSpecialBlog(req: Request, res: Response) {
        const inputDataPost = req.body;
        const {blogId} = req.params;

        const result = await this.blogsQueryRepositories.findBlogById(blogId);

        if (!result.data) {
            res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
            return
        }

        const post = {
            blogId,
            ...inputDataPost
        }

        const createdPost = await this.postsServices.createPost(post);

        if (createdPost.data) {
            res.status(HTTP_STATUSES[createdPost.status]).send(createdPost.data)
            return
        }
        res.status(HTTP_STATUSES[createdPost.status]).send({error: createdPost.errorMessage, data: createdPost.data})
        return
    }
}

