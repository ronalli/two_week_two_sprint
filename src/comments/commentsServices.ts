import {ICommentAdd, ICommentViewModel} from "./types/comments-types";
import {commentsMongoRepositories} from "./commentsMongoRepositories";
import {commentsQueryRepositories} from "./commentsQueryRepositories";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {Result} from "../types/result.type";
import {ResultCode} from "../types/resultCode";
import {IPaginator} from "../types/output-paginator";

export const commentsServices = {
    update: async (id: string, content: string) => {
        return await commentsMongoRepositories.updateComment(id, content);
    },
    delete: async () => {

    },
    create: async (data: ICommentAdd) => {
        return await commentsMongoRepositories.addComment(data)
    },
    findComments: async (postId: string, queryParams: ICommentsQueryType): Promise<Result<IPaginator<ICommentViewModel[]> | null>> => {
        const result = await commentsQueryRepositories.getCommentsForSpecialPost(postId, queryParams)
        if(result.items) {
            return {
                status: ResultCode.Success,
                data: result
            }
        }
            return {
                status: ResultCode.BadRequest,
                errorMessage: result.error,
                data: null
        }
    }
}