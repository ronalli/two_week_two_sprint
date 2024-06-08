import {ICommentAdd} from "./types/comments-types";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {ResultCode} from "../types/resultCode";
import {jwtService} from "../utils/jwt-services";
import {postsQueryRepositories} from "../posts/postsQueryRepositories";
import {CommentsRepositories} from "./commentsRepositories";
import {CommentsQueryRepositories} from "./commentsQueryRepositories";


export class CommentsServices {
    private commentsRepositories: CommentsRepositories
    private commentsQueryRepositories: CommentsQueryRepositories
    constructor() {
        this.commentsRepositories = new CommentsRepositories()
        this.commentsQueryRepositories = new CommentsQueryRepositories()
    }

    async update(id: string, content: string, token: string) {
        const userId = await jwtService.getUserIdByToken(token);
        const result = await this.commentsQueryRepositories.getCommentById(id);
        if (result.errorMessage) {
            return result;
        }
        if (result.data && userId !== result.data.commentatorInfo.userId) {
            return {
                status: ResultCode.Forbidden,
                errorMessage: 'Try edit the comment that is not your own',
                data: null
            }
        }
        return await this.commentsRepositories.updateComment(id, content);
    }

    async delete(id: string, token: string) {
        const result = await this.commentsQueryRepositories.getCommentById(id);
        const userId = await jwtService.getUserIdByToken(token);
        if (result.errorMessage) {
            return result
        }
        if (result.data && userId !== result.data.commentatorInfo.userId) {
            return {
                status: ResultCode.Forbidden,
                errorMessage: 'Try edit the comment that is not your own',
                data: null
            }
        }
        return await this.commentsRepositories.deleteComment(id);
    }
    async create(data: ICommentAdd) {
        const {postId} = data;
        const findPost = await postsQueryRepositories.findPostById(postId);
        if (findPost.errorMessage) {
            return findPost
        }
        return await this.commentsRepositories.addComment(data);
    }
    async findComments(postId: string, queryParams: ICommentsQueryType) {
        const result = await postsQueryRepositories.findPostById(postId);
        if (result.data) {
            return await this.commentsQueryRepositories.getCommentsForSpecialPost(postId, queryParams)
        }
        return result;
    }

}