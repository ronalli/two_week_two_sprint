import {Request, Response} from 'express'
import {HTTP_STATUSES} from "../settings";
import {PostsServices} from "./postsServices";
import {IPostInputModel} from "./types/posts-types";
import {IPostQueryType} from "./types/request-response-type";
import {CommentsServices} from "../comments/commentsServices";
import {ICommentsQueryType} from "../comments/types/output-paginator-comments-types";
import {PostsQueryRepositories} from "./postsQueryRepositories";
import {serviceInfo} from "../common/utils/serviceInfo";
import {inject, injectable} from "inversify";
import {ILikeTypeDB, LikeStatus} from "../types/like.status-type";

@injectable()
export class PostsController {
    constructor(@inject(PostsServices) protected postsServices: PostsServices, @inject(CommentsServices) protected commentsServices: CommentsServices, @inject(PostsQueryRepositories) protected postsQueryRepositories: PostsQueryRepositories) {
    }

    async createPost(req: Request, res: Response) {
        const inputDataPost: IPostInputModel = req.body;

        const token = req.headers.authorization?.split(' ')[1] || "unknown";
        const currentUser = await serviceInfo.getIdUserByToken(token)

        const result = await this.postsServices.createPost(inputDataPost, currentUser);



        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage})
        return
    }

    async getPost(req: Request, res: Response) {
        const {id} = req.params;
        const token = req.cookies.refreshToken || '';

        const currentUser = await serviceInfo.getIdUserByToken(token)

        const result = await this.postsServices.getPost(id, currentUser)
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage})
        return
    }

    async getPosts(req: Request, res: Response) {
        const queryParams: IPostQueryType = req.query;

        const token = req.cookies.refreshToken || '';

        const currentUser = await serviceInfo.getIdUserByToken(token)


        const result= await this.postsQueryRepositories.getPosts(queryParams, currentUser)

        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data);
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage})
    }

    async updatePost(req: Request, res: Response) {
        const {id} = req.params;
        const updateDataPost: IPostInputModel = req.body;
        const result = await this.postsServices.updatePost(id, updateDataPost)
        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage})
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
        return
    }

    async deletePost(req: Request, res: Response) {
        const {id} = req.params;
        const result = await this.postsServices.deletePost(id);
        if (result.errorMessage) {
            res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data});
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({})
    }

    async createCommentForSpecialPost(req: Request, res: Response) {
        const {postId} = req.params;
        const {content} = req.body;
        const userId = req.userId!

        const result = await this.commentsServices.create({postId, userId, content})

        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return
    }

    async getAllCommentsForPost(req: Request, res: Response) {
        const queryParams: ICommentsQueryType = req.query;
        const token = req.cookies.refreshToken || '';

        const currentUser = await serviceInfo.getIdUserByToken(token)

        const {postId} = req.params;

        const result = await this.commentsServices.findAllComments(postId, queryParams, currentUser)

        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }

        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return;
    }

    async updateLikeStatusForSpecialPost(req: Request, res: Response) {

        const {postId} = req.params;
        const userId = req.userId!;
        const login = req.login!;

        const dataLikeStatus: { likeStatus: LikeStatus } = req.body;

        const objLike: Omit<ILikeTypeDB, 'addedAt'> = {
            parentId: postId,
            userId: userId,
            login: login,
            status: dataLikeStatus.likeStatus
        }

        const response = await this.postsServices.updateLikeStatus(objLike)

        res.status(HTTP_STATUSES[response.status]).send({})

    }
}

