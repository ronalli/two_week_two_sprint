import {Request, Response} from "express";
import {commentsQueryRepositories} from "./commentsQueryRepositories";
import {HTTP_STATUSES} from "../settings";
import {commentsMongoRepositories} from "./commentsMongoRepositories";
import {commentsServices} from "./commentsServices";

export const commentsController = {
    // addComment: async (req: Request, res: Response) => {
    //     // const {postId} = req.params;
    //     // const {content} = req.body;
    //     // const token = req.headers.authorization!.split(' ')[1];
    //     // const userId = await jwtService.getUserIdByToken(token);
    //     //
    //     // console.log(postId, content, userId)
    //     //
    //     // const newComment = await commentsServices.add()
    // },
    getComment: async (req: Request, res: Response) => {
        const {commentId} = req.params;
        const comment = await commentsQueryRepositories.getCommentById(commentId)
        if(comment) {
            res.status(HTTP_STATUSES.OK_200).json(comment)
            return;
        }
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})

    },
    updateComment: async (req: Request, res: Response) => {
        const {commentId} = req.params;
        const {content} = req.body;
        const success = await commentsServices.update(commentId, content)
        if (success) {
            res.status(HTTP_STATUSES.CREATED_201).send({})
            return;
        }
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({})
        return;
    },
    deleteComment: async (req: Request, res: Response) => {}
}