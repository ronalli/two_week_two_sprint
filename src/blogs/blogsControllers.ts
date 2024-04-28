import {Request, Response} from "express";
import {HTTP_STATUSES} from "../settings";
import {blogsQueryRepositories} from "./blogsQueryRepositories";
import {postsMongoRepositories} from "../posts/postsMongoRepositories";
import {blogsServices} from "./blogsServices";
import {IBlogInputModel} from "./types/blogs-types";
import {IBlogQueryType} from "./types/request-response-type";
import {postsServices} from "../posts/postsServices";

export const blogsControllers = {
    createBlog: async (req: Request, res: Response) => {
        const inputDataBlog: IBlogInputModel = req.body;
        const createdBlog = await blogsServices.createBlog(inputDataBlog);
        if (createdBlog) {
            res.status(HTTP_STATUSES.CREATED_201).send(createdBlog)
            return;
        }
        res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
    },
    getBlog: async (req: Request, res: Response) => {
        const {id}= req.params;
        const blog = await blogsQueryRepositories.findBlogById(id);
        if(blog) {
            res.status(HTTP_STATUSES.OK_200).send(blog)
            return
        }
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
    },
    getBlogs: async (req: Request, res: Response) => {

        const queryParams: IBlogQueryType = req.query;

        const findBlogs = await blogsQueryRepositories.getAllBlogs(queryParams);
        return res.status(HTTP_STATUSES.OK_200).send(findBlogs)
    },
    updateBlog: async (req: Request, res: Response) => {
        const {id} = req.params;
        const inputUpdateDataBlog: IBlogInputModel = req.body;
        const flag = await blogsServices.updateBlog(id, inputUpdateDataBlog)
        if(flag) {
            return res.status(HTTP_STATUSES.NO_CONTENT_204).send({})
        }
        return res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
    },
    deleteBlog: async (req: Request, res: Response) => {
        const {id} = req.params;
        const flag = await blogsServices.deleteBlog(id);
        if(flag) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send({})
            return
        }
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
        return
    },
    getAllPostsForBlog: async (req: Request, res: Response) => {
        const {blogId} = req.params;
        const queryParams: IBlogQueryType = req.query;

        const result = await blogsQueryRepositories.getAndSortPostsSpecialBlog(blogId, queryParams)

        res.status(HTTP_STATUSES.OK_200).send(result)
    },

    createPostForSpecialBlog: async (req: Request, res: Response) => {
        const inputDataPost = req.body;
        const {blogId} = req.params;

        const post = {
            blogId,
            ...inputDataPost
        }

        const createdPost = await postsServices.createPost(post);

        if (!createdPost) {
            res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
            return
        }
        res.status(HTTP_STATUSES.CREATED_201).send(createdPost)
        return;
    }
}