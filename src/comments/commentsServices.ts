import {ICommentAdd, ICommentViewModel} from "./types/comments-types";
import {commentsMongoRepositories} from "./commentsMongoRepositories";
import {commentsQueryRepositories} from "./commentsQueryRepositories";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {ResultCode} from "../types/resultCode";
import {jwtService} from "../utils/jwt-services";
import {postsQueryRepositories} from "../posts/postsQueryRepositories";

export const commentsServices = {
    update: async (id: string, content: string, token: string) => {
        const userId = await jwtService.getUserIdByToken(token);
        const result = await commentsQueryRepositories.getCommentById(id);

        if (result.errorMessage) {
            return result;
        }

        if(result.data && userId !== result.data.commentatorInfo.userId) {
            return {
                status: ResultCode.Forbidden,
                errorMessage: 'Try edit the comment that is not your own',
                data: null
            }
        }

        return await commentsMongoRepositories.updateComment(id, content);

    },
    delete: async (id: string, token: string) => {
        const result = await commentsQueryRepositories.getCommentById(id);
        const userId = await jwtService.getUserIdByToken(token);

        if (result.errorMessage) {
            return result
        }

        if (result.data && userId !== result.data.commentatorInfo.userId) {
            return {
                status: ResultCode.Forbidden,
                errorMessage: 'Try edit the comment that is not your own',
                data: null
            }
        }

       return  await commentsMongoRepositories.deleteComment(id);

    },
    create: async (data: ICommentAdd) => {
        const {postId} = data;
        const findPost = await postsQueryRepositories.findPostById(postId);
        const result = await commentsMongoRepositories.addComment(data)

        if (findPost.errorMessage) {
            return findPost
        }

        return result;

    },
    findComments: async (postId: string, queryParams: ICommentsQueryType) => {

        const result = await postsQueryRepositories.findPostById(postId);

        if (result.data) {
            return await commentsQueryRepositories.getCommentsForSpecialPost(postId, queryParams)

        }
        return result;
    }
}