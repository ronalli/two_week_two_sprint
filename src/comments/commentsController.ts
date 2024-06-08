import {Request, Response} from "express";
import {CommentsQueryRepositories} from "./commentsQueryRepositories";
import {HTTP_STATUSES} from "../settings";
import {CommentsServices} from "./commentsServices";


export class CommentsController {
    private commentsServices: CommentsServices
    private commentsQueryRepositories: CommentsQueryRepositories
    constructor() {
        this.commentsQueryRepositories = new CommentsQueryRepositories();
        this.commentsServices = new CommentsServices();
    }

    async getComment(req: Request, res: Response) {
        const {commentId} = req.params;
        const result = await this.commentsQueryRepositories.getCommentById(commentId)
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).json(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return

    }

    async updateComment(req: Request, res: Response) {
        const {commentId} = req.params;
        const {content} = req.body;
        const token = req.headers.authorization?.split(" ")[1]!;

        const result = await this.commentsServices.update(commentId, content, token)

        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})

    }

    async deleteComment(req: Request, res: Response) {
        const {commentId} = req.params;
        const token = req.headers.authorization?.split(" ")[1]!;
        const result = await this.commentsServices.delete(commentId, token)


        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
            return
        }

        res.status(HTTP_STATUSES[result.status]).send({})
        return;
    }
}

export const commentsController = new CommentsController();