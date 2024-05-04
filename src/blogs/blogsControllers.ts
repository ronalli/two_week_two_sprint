import {Request, Response} from "express";
import {HTTP_STATUSES, HTTP_STATUSES1} from "../settings";
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
            res.status(HTTP_STATUSES1[result.status]).send(result.data)
            return;
        }
        res.status(HTTP_STATUSES1[result.status]).send({error: result.errorMessage})
    },
    getBlog: async (req: Request, res: Response) => {
        const {id} = req.params;
        const foundBlog = await blogsQueryRepositories.findBlogById(id);
        if (foundBlog.data) {
            res.status(HTTP_STATUSES1[foundBlog.status]).send(foundBlog.data)
            return
        }
        res.status(HTTP_STATUSES1[foundBlog.status]).send({error: foundBlog.errorMessage})
        return
    },
    getBlogs: async (req: Request, res: Response) => {
        const queryParams: IBlogQueryType = req.query;
        const findBlogs = await blogsQueryRepositories.getAllBlogs(queryParams);

        if (findBlogs.data) {
            res.status(HTTP_STATUSES1[findBlogs.status]).send(findBlogs.data)
            return
        }

        res.status(HTTP_STATUSES1[findBlogs.status]).send({error: findBlogs.errorMessage})
        return
    },
    updateBlog: async (req: Request, res: Response) => {
        const {id} = req.params;
        const inputUpdateDataBlog: IBlogInputModel = req.body;
        const result = await blogsServices.updateBlog(id, inputUpdateDataBlog)
        res.status(HTTP_STATUSES1[result.status]).send(result.errorMessage ? {error: result.errorMessage} : {})
        return
    },
    deleteBlog: async (req: Request, res: Response) => {
        const {id} = req.params;
        const result = await blogsServices.deleteBlog(id);
        res.status(HTTP_STATUSES1[result.status]).send(result.errorMessage ? {error: result.errorMessage} : {})
        return
    },
    getAllPostsForBlog: async (req: Request, res: Response) => {
        const {blogId} = req.params;
        const queryParams: IBlogQueryType = req.query;

        const result = await blogsQueryRepositories.findBlogById(blogId);
        if (result.data) {
            const foundPosts = await blogsQueryRepositories.getAndSortPostsSpecialBlog(blogId, queryParams)
            res.status(HTTP_STATUSES1[foundPosts.status]).send(foundPosts.data ? foundPosts.data : {error: foundPosts.errorMessage})
            return
        }

        res.status(HTTP_STATUSES1[result.status]).send({error: result.errorMessage})
        return

    },
    createPostForSpecialBlog: async (req: Request, res: Response) => {
        const inputDataPost = req.body;
        const {blogId} = req.params;

        const foundBlog = await blogsQueryRepositories.findBlogById(blogId);

        if (!foundBlog.data) {
            res.status(HTTP_STATUSES1[foundBlog.status]).send({error: foundBlog.errorMessage})
            return
        }

        const post = {
            blogId,
            ...inputDataPost
        }

        ///нужно переделать endpoint post
        const createdPost = await postsServices.createPost(post);

        if (!createdPost) {
            res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
            return
        }
        res.status(HTTP_STATUSES.CREATED_201).send(createdPost)
        return
    }
}