import {ICommentAdd, ICommentDBType, ICommentViewModel} from "./types/comments-types";
import {ObjectId} from "mongodb";
import {ResultCode} from "../types/resultCode";
import {CommentModel} from "./domain/comment.entity";
import {mappingComments} from "../common/utils/mappingComments";
import {UsersQueryRepositories} from "../users/usersQueryRepositories";
import {ILikeTypeDB, LikeModel} from "./domain/like.entity";
import {ILikesInfoViewModel} from "./types/likes-info-types";

export class CommentsRepositories {
    constructor(protected usersQueryRepositories: UsersQueryRepositories) {
    }

    async updateComment(id: string, contentUpdate: string) {
        try {
            const findComment = await CommentModel.findOne({_id: new ObjectId(id)});
            if (findComment) {
                findComment.content = contentUpdate;
                await findComment.save();
                return {status: ResultCode.NotContent, data: null}
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null};
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    }

    async deleteComment(id: string) {
        try {
            await CommentModel.deleteOne({_id: new ObjectId(id)});
            return {status: ResultCode.NotContent, data: null};
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null};
        }
    }

    async addComment(data: ICommentAdd) {

        const result = await this.usersQueryRepositories.findUserById(data.userId)
        const dataComment: ICommentDBType = {
            postId: data.postId,
            content: data.content,
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: data.userId,
                userLogin: result.data!.login
            }
        }
        try {
            const newComment = new CommentModel(dataComment);
            const response = await newComment.save();
            const comment = await CommentModel.findOne({_id: new ObjectId(response._id)});

            const likesInfo: ILikesInfoViewModel = {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }

            if (comment) {
                const res = mappingComments.formatCommentForView(comment, likesInfo);
                return {status: ResultCode.Created, data: res}
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null};
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }

    async addLike(data: Omit<ILikeTypeDB, 'createdAt'>) {
        const like = new LikeModel();

        like.userId = data.userId;
        like.parentId = data.parentId;
        like.status = data.status;
        like.createdAt = new Date().toISOString();

        await like.save();

        return like;
    }

    async updateStatusLike(data: Omit<ILikeTypeDB, 'createdAt'>) {

        const currentStatus = await LikeModel.findOne(({
            $and: [{userId: data.userId}, {parentId: data.parentId}]
        }))

        if (!currentStatus) {
            return {
                status: ResultCode.BadRequest, data: null, errorsMessages: [
                    {
                        "message": "Wrong",
                        "field": 'status'
                    }
                ]
            }
        }

        if (currentStatus.status === data.status) {
            return {status: ResultCode.NotContent, data: null}
        }

        currentStatus.status = data.status;
        await currentStatus.save();

        return {status: ResultCode.NotContent, data: null}
    }
}