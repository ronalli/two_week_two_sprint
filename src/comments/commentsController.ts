import {Request, Response} from "express";
import {CommentsQueryRepositories} from "./commentsQueryRepositories";
import {HTTP_STATUSES} from "../settings";
import {CommentsServices} from "./commentsServices";
import {decodeToken} from "../common/utils/decodeToken";
import {ILikeTypeDB} from "./domain/like.entity";
import {serviceInfo} from "../common/utils/serviceInfo";

export class CommentsController {
    constructor(protected commentsServices: CommentsServices, protected commentsQueryRepositories: CommentsQueryRepositories) {
    }

    async getComment(req: Request, res: Response) {
        const {commentId} = req.params;

        const token = req.headers.authorization?.split(' ')[1] || "unknown";

        const currentStatus = await serviceInfo.initializeStatusLike(token, commentId)

        const result = await this.commentsQueryRepositories.getComment(commentId, currentStatus)

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

    async updateLikeStatusForSpecialPost(req: Request, res: Response) {
        const {commentId} = req.params;
        const header = req.headers.authorization?.split(' ')[1]!;
        const dataUser = await decodeToken(header);
        const dataBody = req.body;

        const objLike: Omit<ILikeTypeDB, 'createdAt'> = {
            parentId: commentId,
            userId: dataUser?.userId!,
            status: dataBody.likeStatus,
        }

        const response = await this.commentsServices.updateLikeStatus(objLike)

        res.status(HTTP_STATUSES[response.status]).send({})

    }
}