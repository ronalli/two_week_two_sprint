import {Request, Response} from 'express'
import {HTTP_STATUSES} from "../settings";
import {postsQueryRepositories} from "./postsQueryRepositories";
import {PostsServices} from "./postsServices";
import {IPostInputModel} from "./types/posts-types";
import {IPostQueryType} from "./types/request-response-type";
import {jwtService} from "../utils/jwt-services";
import {CommentsServices} from "../comments/commentsServices";
import {ICommentsQueryType} from "../comments/types/output-paginator-comments-types";


export class PostsControllers {
    private postsServices: PostsServices
    private commentsServices: CommentsServices
    constructor() {
        this.postsServices = new PostsServices();
        this.commentsServices = new CommentsServices()

    }

    async createPost(req: Request, res: Response) {
        const inputDataPost: IPostInputModel = req.body;
        const result = await this.postsServices.createPost(inputDataPost);
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage})
        return
    }

    async getPost(req: Request, res: Response) {
        const {id} = req.params;
        const result = await postsQueryRepositories.findPostById(id)
        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }
        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage})
        return
    }

    async getPosts(req: Request, res: Response) {
        const queryParams: IPostQueryType = req.query;
        const result = await postsQueryRepositories.getPosts(queryParams)
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
        const token = req.headers.authorization?.split(" ")[1];
        let userId = await jwtService.getUserIdByToken(token!);

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
        const {postId} = req.params;
        const result = await this.commentsServices.findComments(postId, queryParams)

        if (result.data) {
            res.status(HTTP_STATUSES[result.status]).send(result.data)
            return
        }

        res.status(HTTP_STATUSES[result.status]).send({errorMessage: result.errorMessage, data: result.data})
        return;

    }
}

export const postsControllers = new PostsControllers();

