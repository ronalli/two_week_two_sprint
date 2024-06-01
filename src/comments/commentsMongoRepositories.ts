import {ICommentAdd, ICommentDBType, ICommentViewModel} from "./types/comments-types";
import {usersQueryRepositories} from "../users/usersQueryRepositories";
import {ObjectId} from "mongodb";
import {ResultCode} from "../types/resultCode";
import {CommentModel} from "./domain/comment.entity";

export const commentsMongoRepositories = {
    updateComment: async (id: string, contentUpdate: string) => {
        try {
            const findComment = await CommentModel.findOne({_id: new ObjectId(id)});
            if(findComment) {

                findComment.content = contentUpdate;

                await findComment.save();

                return {status: ResultCode.NotContent, data: null}
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null};
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    },
    deleteComment: async (id: string) => {
        try {
            await CommentModel.deleteOne({_id: new ObjectId(id)});
            return {status: ResultCode.NotContent, data: null};
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null};
        }

    },
    addComment: async (data: ICommentAdd) => {

        const result = await usersQueryRepositories.findUserById(data.userId)

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

                const res = commentsMongoRepositories._mapping(comment);

                return {status: ResultCode.Created, data: res}
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null};

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    },

    //дублирование commentsQueryRepositories
    _mapping: (comment: ICommentDBType): ICommentViewModel => {
        return {
            id: String(comment._id),
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin,
            },
            createdAt: comment.createdAt,
            content: comment.content,
        }
    }
}