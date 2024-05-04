import {ICommentAdd, ICommentDBType, ICommentViewModel} from "./types/comments-types";
import {commentsCollection, usersCollection} from "../db/mongo-db";
import {usersController} from "../users/usersControllers";
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
                return {status: 204}
            }
            return {error: 'Not found comment', status: 404};
        } catch (e) {
            return {error: 'Error BD', status: 400}
        }
    },
    deleteComment: async (id: string) => {
        try {
            await commentsCollection.findOneAndDelete({_id: new ObjectId(id)});
            return {status: 204};
        } catch (e) {
            return {error: 'Error deleting comment', status: 400};
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
                userLogin: result.item!.login
            }
        }

        try {
            const insertedComment = await commentsCollection.insertOne(newComment);
            const foundComment = await commentsCollection.findOne({_id: insertedComment.insertedId})
            if (foundComment) {
                return {status: ResultCode.Created, item: commentsMongoRepositories._mapping(foundComment)}
            }
            return {error: 'Not found comment', status: ResultCode.NotFound};

        } catch (e) {
            return {error: 'Error DB', status: ResultCode.BadRequest}
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