import {Request, Response} from 'express'
import {HTTP_STATUSES} from "../settings";
import {postsQueryRepositories} from "./postsQueryRepositories";
import {postsServices} from "./postsServices";
import {IPostInputModel} from "./types/posts-types";
import {IPostQueryType} from "./types/request-response-type";
import {jwtService} from "../utils/jwt-services";
import {commentsServices} from "../comments/commentsServices";
import {ICommentsQueryType} from "../comments/types/output-paginator-comments-types";
import {ResultCode} from "../types/resultCode";

export const postsControllers = {
    createPost: async (req: Request, res: Response) => {
        const inputDataPost: IPostInputModel = req.body;
        const newPosts = await postsServices.createPost(inputDataPost);
        if (!newPosts) {
            res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
            return
        }
        res.status(HTTP_STATUSES.CREATED_201).send(newPosts)
        return;
    },
    getPost: async (req: Request, res: Response) => {
        const {id} = req.params;
        const findPost = await postsQueryRepositories.findPostById(id)
        if (findPost) {
            res.status(HTTP_STATUSES.OK_200).send(findPost)
            return
        }
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
        return
    },
    getPosts: async (req: Request, res: Response) => {
        const queryParams: IPostQueryType = req.query;
        const findPosts = await postsQueryRepositories.getPosts(queryParams)
        res.status(HTTP_STATUSES.OK_200).send(findPosts)
    },
    updatePost: async (req: Request, res: Response) => {
        const {id} = req.params;
        const updateDataPost: IPostInputModel = req.body;
        const flag = await postsServices.updatePost(id, updateDataPost)
        if (flag) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send({})
            return
        }
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
        return;
    },
    deletePost: async (req: Request, res: Response) => {
        const {id} = req.params;
        const flag = await postsServices.deletePost(id);
        if (flag) {
            res.status(HTTP_STATUSES.NO_CONTENT_204).send({});
            return;
        }
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
    },
    createCommentForSpecialPost: async (req: Request, res: Response) => {
        const {postId} = req.params;
        const {content} = req.body;
        const token = req.headers.authorization?.split(" ")[1];
        let userId = await jwtService.getUserIdByToken(token!);

        const result = await commentsServices.create({postId, userId, content})

        if (result.data) {
            res.status(HTTP_STATUSES.CREATED_201).send(result.data)
            return
        }

        if (result.status === ResultCode.NotFound) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
            return;
        }

        res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
        return
    },

    getAllCommentsForPost: async (req: Request, res: Response) => {
        const queryParams: ICommentsQueryType = req.query;
        const {postId} = req.params;
        const result = await commentsServices.findComments(postId, queryParams)

        if (result.data) {
            res.status(HTTP_STATUSES.OK_200).send(result.data)
            return
        }

        if (result.status === ResultCode.NotFound) {
            res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
            return
        }

        res.status(HTTP_STATUSES.BED_REQUEST_400).send({})
        return;

    }
}

