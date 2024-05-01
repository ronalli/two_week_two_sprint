import {ICommentAdd, ICommentDBType, ICommentViewModel} from "./types/comments-types";
import {commentsCollection, usersCollection} from "../db/mongo-db";
import {usersController} from "../users/usersControllers";
import {usersQueryRepositories} from "../users/usersQueryRepositories";
import {ObjectId} from "mongodb";

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
                return true;
            }
            return  false;
        } catch (e) {
            return;
        }
    },
    deleteComment: async () => {},
    addComment: async (data: ICommentAdd) => {

        const user = await usersQueryRepositories.findUserById(data.userId)

        const newComment: ICommentDBType = {
            postId: data.postId,
            content: data.content,
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
                return commentsMongoRepositories._mapping(foundComment);
            }
            return;

        } catch (e) {
            return
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