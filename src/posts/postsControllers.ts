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
        const result = await postsServices.createPost(inputDataPost);
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage})
        return
    },
    getPost: async (req: Request, res: Response) => {
        const {id} = req.params;
        const result = await postsQueryRepositories.findPostById(id)
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage})
        return
    },
    getPosts: async (req: Request, res: Response) => {
        const queryParams: IPostQueryType = req.query;
        const result = await postsQueryRepositories.getPosts(queryParams)
        if(result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data);
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage})
    },
    updatePost: async (req: Request, res: Response) => {
        const {id} = req.params;
        const updateDataPost: IPostInputModel = req.body;
        const result = await postsServices.updatePost(id, updateDataPost)
        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return
    },
    deletePost: async (req: Request, res: Response) => {
        const {id} = req.params;
        const result = await postsServices.deletePost(id);
        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data});
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
    },

    createCommentForSpecialPost: async (req: Request, res: Response) => {
        const {postId} = req.params;
        const {content} = req.body;
        const token = req.headers.authorization?.split(" ")[1];
        let userId = await jwtService.getUserIdByToken(token!);

        const result = await commentsServices.create({postId, userId, content})

        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return
    },


    getAllCommentsForPost: async (req: Request, res: Response) => {
        const queryParams: ICommentsQueryType = req.query;
        const {postId} = req.params;
        const result = await commentsServices.findComments(postId, queryParams)

        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }

        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return;

    }
}

