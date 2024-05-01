import {ICommentAdd, ICommentViewModel} from "./types/comments-types";
import {commentsMongoRepositories} from "./commentsMongoRepositories";
import {commentsQueryRepositories} from "./commentsQueryRepositories";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {Result} from "../types/result.type";
import {ResultCode} from "../types/resultCode";
import {IPaginator} from "../types/output-paginator";
import {jwtService} from "../utils/jwt-services";

export const commentsServices = {
    update: async (id: string, content: string, token: string) => {

        const userId = await jwtService.getUserIdByToken(token);
        const comment = await commentsQueryRepositories.getCommentById(id);
        if(userId !== comment?.id) {
            return {
                status: ResultCode.Forbidden,
                errorMessage: 'Try edit the comment that is not your own',
                data: null
            }
        }

        const result = await commentsMongoRepositories.updateComment(id, content);

        if(result.status === 204) {
            return {
                status: ResultCode.NotContent,
                data: null
            }
        }

        if(result.status === 400) {
            return {
                status: ResultCode.BadRequest,
                data: null
            }
        }

        return {
            status: ResultCode.Forbidden,
            data: null
        }
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