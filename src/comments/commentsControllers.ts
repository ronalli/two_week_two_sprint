import {Request, Response} from "express";
import {commentsQueryRepositories} from "./commentsQueryRepositories";
import {HTTP_STATUSES} from "../settings";
import {commentsServices} from "./commentsServices";

export const commentsController = {
    getComment: async (req: Request, res: Response) => {
        const {commentId} = req.params;
        const result = await commentsQueryRepositories.getCommentById(commentId)
        if(result.data) {
            res.status(HTTP_STATUSES[result.status]).json(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return

    },
    updateComment: async (req: Request, res: Response) => {
        const {commentId} = req.params;
        const {content} = req.body;
        const token = req.headers.authorization?.split(" ")[1]!;

        const result = await commentsServices.update(commentId, content, token)

        if(result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})

    },
    deleteComment: async (req: Request, res: Response) => {
        const {commentId} = req.params;
        const token = req.headers.authorization?.split(" ")[1]!;
        const result = await commentsServices.delete(commentId, token)


        if(result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
            return
        }

        res.status(HTTP_STATUSES[result.status]).send({})
        return;
    }
}