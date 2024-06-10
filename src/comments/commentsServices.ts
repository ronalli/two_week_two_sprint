import {ICommentAdd} from "./types/comments-types";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {ResultCode} from "../types/resultCode";
import {jwtService} from "../utils/jwt-services";
import {CommentsRepositories} from "./commentsRepositories";
import {CommentsQueryRepositories} from "./commentsQueryRepositories";
import {PostsQueryRepositories} from "../posts/postsQueryRepositories";
import {ILikeTypeDB} from "./domain/like.entity";

export class CommentsServices {
    constructor(protected commentsRepositories: CommentsRepositories, protected commentsQueryRepositories: CommentsQueryRepositories, protected postsQueryRepositories: PostsQueryRepositories) {
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
        const findPost = await this.postsQueryRepositories.findPostById(postId);
        if (findPost.errorMessage) {
            return findPost
        }
        return await this.commentsRepositories.addComment(data);
    }

    // async findComments(postId: string, queryParams: ICommentsQueryType) {
    //     const result = await this.postsQueryRepositories.findPostById(postId);
    //     if (result.data) {
    //         return await this.commentsQueryRepositories.getCommentsForSpecialPost(postId, queryParams)
    //     }
    //     return result;
    // }


    /// update method

    async findAllComments(postId: string, queryParams: ICommentsQueryType, currentUser: string | null) {
        const result = await this.postsQueryRepositories.findPostById(postId);


        if (result.data) {
            return await this.commentsQueryRepositories.getCommentsForSpecialPost(postId, queryParams, currentUser)
        }
        return result;
    }


    async updateLikeStatus(dataLike: Omit<ILikeTypeDB, 'createdAt'>) {
        const validComment = await this.commentsQueryRepositories.getCommentById(dataLike.parentId)

        if (validComment.errorMessage) {
            return {
                status: validComment.status,
                data: null,
                errorsMessages: [
                    {
                        "message": validComment.errorMessage,
                        "field": 'comment id'
                    }
                ]
            }
        }

        const searchLike = await this.commentsQueryRepositories.getCurrentLike(dataLike.parentId, dataLike.userId)

        if (!searchLike) {
            await this.commentsRepositories.addLike(dataLike)
            return {status: ResultCode.NotContent, data: null}
        }

        return await this.commentsRepositories.updateStatusLike(dataLike);
    }
}