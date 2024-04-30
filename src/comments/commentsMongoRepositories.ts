import {ICommentAdd, ICommentDBType, ICommentViewModel} from "./types/comments-types";
import {commentsCollection, usersCollection} from "../db/mongo-db";
import {usersController} from "../users/usersControllers";
import {usersQueryRepositories} from "../users/usersQueryRepositories";

export const commentsMongoRepositories = {
    updateComment: async () => {

    },
    deleteComment: async () => {},
    addComment: async (data: ICommentAdd) => {

        const user = await usersQueryRepositories.findUserById(data.userId)

        const newComment: ICommentDBType = {
            ...data,
            createdAt: new Date().toISOString(),
            commentatorInfo: {
                userId: data.userId,
                userLogin: user!.login
            }
        }

        try {
            const insertedComment = await commentsCollection.insertOne(newComment);
            const foundComment = await commentsCollection.findOne({_id: insertedComment.insertedId})
            if (foundComment) {
                return commentsMongoRepositories._maping(foundComment);
            }
            return;

        } catch (e) {
            return
        }
    },

    _maping: (comment: ICommentDBType): ICommentViewModel => {
        return {
            id: String(comment._id),
            commentatorInfo: {...comment.commentatorInfo},
            createdAt: comment.createdAt,
            content: comment.content,
        }
    }
}