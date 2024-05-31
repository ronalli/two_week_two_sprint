import {ICommentAdd, ICommentDBType, ICommentViewModel} from "./types/comments-types";
import {commentsCollection} from "../db/mongo-db";
import {usersQueryRepositories} from "../users/usersQueryRepositories";
import {ObjectId} from "mongodb";
import {ResultCode} from "../types/resultCode";

export const commentsMongoRepositories = {
    updateComment: async (id: string, contentUpdate: string) => {
        try {
            const findComment = await commentsCollection.findOne({_id: new ObjectId(id)});
            if(findComment) {
                await commentsCollection.findOneAndUpdate({_id: new ObjectId(id)}, {
                    $set: {
                        content: contentUpdate
                    }
                })
                return {status: ResultCode.NotContent, data: null}
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null};
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    },
    deleteComment: async (id: string) => {
        try {
            await commentsCollection.findOneAndDelete({_id: new ObjectId(id)});
            return {status: ResultCode.NotContent, data: null};
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null};
        }

    },
    addComment: async (data: ICommentAdd) => {

        const result = await usersQueryRepositories.findUserById(data.userId)

        const newComment: ICommentDBType = {
            postId: data.postId,
            content: data.content,
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: data.userId,
                userLogin: result.data!.login
            }
        }

        try {
            const insertedComment = await commentsCollection.insertOne(newComment);
            const foundComment = await commentsCollection.findOne({_id: insertedComment.insertedId})
            if (foundComment) {
                return {status: ResultCode.Created, data: commentsMongoRepositories._mapping(foundComment)}
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
            commentatorInfo: {...comment.commentatorInfo},
            createdAt: comment.createdAt,
            content: comment.content,
        }
    }
}