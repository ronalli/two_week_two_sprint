import {ICommentAdd, ICommentDBType, ICommentViewModel} from "./types/comments-types";
import {ObjectId} from "mongodb";
import {ResultCode} from "../types/resultCode";
import {CommentModel} from "./domain/comment.entity";
import {mappingComments} from "../common/utils/mappingComments";
import {UsersQueryRepositories} from "../users/usersQueryRepositories";
import {ILikeTypeDB, LikeModel} from "./domain/like.entity";

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
            if (comment) {
                const res = mappingComments.formatDataCommentForView(comment);
                return {status: ResultCode.Created, data: res}
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null};
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }

    async addLike(data: Omit<ILikeTypeDB, 'createdAt'>) {

        // const


    }

    async getCurrentStatusLike(data: Omit<ILikeTypeDB, 'createdAt'>) {
        const response = await LikeModel.findOne(({
            $and: [{userId: data.userId}, {parentId: data.parentId}]
        }))

        if(response) {
            return response;
        }

        const like = new LikeModel();

        like.userId = data.userId;
        like.parentId = data.parentId;
        like.status = data.status;
        like.createdAt = new Date().toISOString();

        await like.save();

        return like;

    }
}