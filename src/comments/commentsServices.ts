import {ICommentAdd} from "./types/comments-types";
import {commentsMongoRepositories} from "./commentsMongoRepositories";

export const commentsServices = {
    update: async () => {

    },
    delete: async () => {

    },
    create: async (data: ICommentAdd) => {
        return await commentsMongoRepositories.addComment(data)
    }
}