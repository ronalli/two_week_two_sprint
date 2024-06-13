import {ICommentAdd} from "./types/comments-types";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {ResultCode} from "../types/resultCode";
import {CommentsRepositories} from "./commentsRepositories";
import {CommentsQueryRepositories} from "./commentsQueryRepositories";
import {PostsQueryRepositories} from "../posts/postsQueryRepositories";
import {ILikeTypeDB, LikeStatus} from "./domain/like.entity";

export class CommentsServices {
    constructor(protected commentsRepositories: CommentsRepositories, protected commentsQueryRepositories: CommentsQueryRepositories, protected postsQueryRepositories: PostsQueryRepositories) {
    }

    async update(id: string, content: string, userId: string) {

        const result = await this.commentsRepositories.getCommentById(id);
        if (!result) {
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null}
        }
        if (result && userId !== result.commentatorInfo.userId) {
            return {
                status: ResultCode.Forbidden,
                errorMessage: 'Try edit the comment that is not your own',
                data: null
            }
        }
        return await this.commentsRepositories.updateComment(id, content);
    }

    async delete(id: string, userId: string) {
        const result = await this.commentsRepositories.getCommentById(id);

        if (!result) {
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null}
        }
        if (result && userId !== result.commentatorInfo.userId) {
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

    async findAllComments(postId: string, queryParams: ICommentsQueryType, currentUser: string | null) {
        const result = await this.postsQueryRepositories.findPostById(postId);

        if (result.data) {
            return await this.commentsRepositories.getCommentsForSpecialPost(postId, queryParams, currentUser)
        }
        return result;
    }

    async updateLikeStatus(dataLike: Omit<ILikeTypeDB, 'createdAt'>) {
        const comment = await this.commentsRepositories.getCommentById(dataLike.parentId)

        if (!comment) {
            return {
                status: ResultCode.BadRequest,
                data: null,
                errorsMessages: [
                    {
                        "message": "Wrong",
                        "field": 'comment id'
                    }
                ]
            }
        }

        const searchLike = await this.commentsRepositories.getCurrentLike(dataLike.parentId, dataLike.userId)

        if (!searchLike) {
            await this.commentsRepositories.addStatusLike(dataLike)
            dataLike.status === LikeStatus.Like ? comment.likesCount += 1 : comment.dislikesCount += 1;

            await comment.save();

            return {status: ResultCode.NotContent, data: null}
        }

        return await this.commentsRepositories.updateStatusLike(dataLike, comment);
    }
}