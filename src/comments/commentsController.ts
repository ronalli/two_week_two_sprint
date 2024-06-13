import {Request, Response} from "express";
import {CommentsQueryRepositories} from "./commentsQueryRepositories";
import {HTTP_STATUSES} from "../settings";
import {CommentsServices} from "./commentsServices";
import {ILikeTypeDB, LikeStatus} from "./domain/like.entity";
import {serviceInfo} from "../common/utils/serviceInfo";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsController {
    constructor(@inject(CommentsServices) protected commentsServices: CommentsServices, @inject(CommentsQueryRepositories) protected commentsQueryRepositories: CommentsQueryRepositories) {
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
        const userId = req.userId!;

        const result = await this.commentsServices.update(commentId, content, userId)

        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return
    }

    async deleteComment(req: Request, res: Response) {
        const {commentId} = req.params;
        const token = req.headers.authorization?.split(" ")[1]!;
        const userId = req.userId!;

        const result = await this.commentsServices.delete(commentId, userId)


        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
            return
        }

        res.status(HTTP_STATUSES[result.status]).send({})
        return;
    }

    async updateLikeStatusForSpecialPost(req: Request, res: Response) {
        const {commentId} = req.params;
        const userId = req.userId!;

        const dataBody: { likeStatus: LikeStatus } = req.body;

        const objLike: Omit<ILikeTypeDB, 'createdAt'> = {
            parentId: commentId,
            userId: userId,
            status: dataBody.likeStatus,
        }

        const response = await this.commentsServices.updateLikeStatus(objLike)

        if(response.errorsMessages) {
            res.status(HTTP_STATUSES[response.status]).send({errorsMessages: response.errorsMessages})
            return;
        }

        res.status(HTTP_STATUSES[response.status]).send({})
        return
    }
}