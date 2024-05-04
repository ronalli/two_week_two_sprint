import {Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {blogsQueryRepositories} from "./blogsQueryRepositories";
import {blogsServices} from "./blogsServices";
import {IBlogInputModel} from "./types/blogs-types";
import {IBlogQueryType} from "./types/request-response-type";
import {postsServices} from "../posts/postsServices";

export const blogsControllers = {
    createBlog: async (req: Request, res: Response) => {
        const inputDataBlog: IBlogInputModel = req.body;
        const result = await blogsServices.createBlog(inputDataBlog);
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return;
        }
        res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
    },
    getBlog: async (req: Request, res: Response) => {
        const {id} = req.params;
        const result = await blogsQueryRepositories.findBlogById(id);
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
        return
    },
    getBlogs: async (req: Request, res: Response) => {
        const queryParams: IBlogQueryType = req.query;
        const result = await blogsQueryRepositories.getAllBlogs(queryParams);

        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }

        res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
        return
    },
    updateBlog: async (req: Request, res: Response) => {
        const {id} = req.params;
        const inputUpdateDataBlog: IBlogInputModel = req.body;
        const result = await blogsServices.updateBlog(id, inputUpdateDataBlog)
        if(result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send(result.data)
        return
    },
    deleteBlog: async (req: Request, res: Response) => {
        const {id} = req.params;
        const result = await blogsServices.deleteBlog(id);
        if(result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send(result.data)
        return
    },
    getAllPostsForBlog: async (req: Request, res: Response) => {
        const {blogId} = req.params;
        const queryParams: IBlogQueryType = req.query;

        const result = await blogsQueryRepositories.findBlogById(blogId);
        if (result.data) {
            const foundPosts = await blogsQueryRepositories.getAndSortPostsSpecialBlog(blogId, queryParams)
            res.status(HTTP_STATUSES[foundPosts.status]).send(foundPosts.data)
            return
        }

        res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
        return

    },
    createPostForSpecialBlog: async (req: Request, res: Response) => {
        const inputDataPost = req.body;
        const {blogId} = req.params;

        const result = await blogsQueryRepositories.findBlogById(blogId);

        if (!result.data) {
            res.status(HTTP_STATUSES[result.status]).send({error: result.errorMessage, data: result.data})
            return
        }

        const post = {
            blogId,
            ...inputDataPost
        }

        const createdPost = await postsServices.createPost(post);

        if (createdPost.data) {
            res.status(HTTP_STATUSES[createdPost.status]).send(createdPost.data)
            return
        }
        res.status(HTTP_STATUSES[createdPost.status]).send({error: createdPost.errorMessage, data: result.data})
        return
    }
}