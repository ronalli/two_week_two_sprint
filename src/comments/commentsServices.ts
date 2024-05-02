import {ICommentAdd, ICommentViewModel} from "./types/comments-types";
import {commentsMongoRepositories} from "./commentsMongoRepositories";
import {commentsQueryRepositories} from "./commentsQueryRepositories";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {Result} from "../types/result.type";
import {ResultCode} from "../types/resultCode";
import {IPaginator} from "../types/output-paginator";
import {jwtService} from "../utils/jwt-services";
import {postsQueryRepositories} from "../posts/postsQueryRepositories";

export const commentsServices = {
    update: async (id: string, content: string, token: string) => {
        const userId = await jwtService.getUserIdByToken(token);
        const comment = await commentsQueryRepositories.getCommentById(id);

        if(!comment) {
            return {
                status: ResultCode.NotFound,
                data: null
            }
        }

        if(userId !== comment?.commentatorInfo.userId) {
            return {
                status: ResultCode.Forbidden,
                errorMessage: 'Try edit the comment that is not your own',
                data: null
            }
        }

        const result = await commentsMongoRepositories.updateComment(id, content);

        if(result.status === 400) {
            return {
                status: ResultCode.BadRequest,
                data: null
            }
        }

        return {
            status: ResultCode.NotContent,
            data: null
        }
    },
    delete: async (id: string, token: string) => {
        const comment = await commentsQueryRepositories.getCommentById(id);
        const userId = await jwtService.getUserIdByToken(token);

        if(!comment) {
            return {
                status: ResultCode.NotFound,
                data: null
            }
        }

        if(userId !== comment?.commentatorInfo.userId) {
            return {
                status: ResultCode.Forbidden,
                errorMessage: 'Try edit the comment that is not your own',
                data: null
            }
        }

        const result = await commentsMongoRepositories.deleteComment(id);


        if(result.status === 400) {
            return {
                status: ResultCode.BadRequest,
                data: null
            }
        }

        return {
            status: ResultCode.NotContent,
            data: null
        }

    },
    create: async (data: ICommentAdd) => {
        const {postId} = data;
        const findPost = await postsQueryRepositories.findPostById(postId);
        const result = await commentsMongoRepositories.addComment(data)

        if(!findPost) {
            return {
                status: ResultCode.NotFound,
                data: null
            }
        }
        if(result.item) {
            return {
                status: result.status,
                data: result.item
            }
        }
        return {
            status: result.status,
            errorMessage: result.error,
            data: null
        }

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