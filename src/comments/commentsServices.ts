import {ICommentAdd} from "./types/comments-types";
import {commentsMongoRepositories} from "./commentsMongoRepositories";
import {commentsQueryRepositories} from "./commentsQueryRepositories";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";

export const commentsServices = {
    update: async () => {

    },
    delete: async () => {

    },
    create: async (data: ICommentAdd) => {
        return await commentsMongoRepositories.addComment(data)
    },
    findComments: async (postId: string, queryParams: ICommentsQueryType) => {
        return await commentsQueryRepositories.getCommentsForSpecialPost(postId, queryParams)
    }
}