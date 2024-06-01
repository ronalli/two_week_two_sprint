import {ICommentDBType, ICommentViewModel} from "./types/comments-types";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {createDefaultValuesQueryParams} from "../utils/helper";
import {ObjectId} from "mongodb";
import {ResultCode} from "../types/resultCode";
import {CommentModel} from "./domain/comment.entity";

export const commentsQueryRepositories = {
    getCommentsForSpecialPost: async (postId: string, queryParams: ICommentsQueryType) => {
        const query = createDefaultValuesQueryParams(queryParams);
        try {
            const filter = {postId: postId}
            const comments = await CommentModel.find(filter)
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)

            const totalCount = await CommentModel.countDocuments(filter);

            return {
                status: ResultCode.Success,
                data: {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    pageSize: query.pageSize,
                    page: query.pageNumber,
                    totalCount,
                    items: commentsQueryRepositories._mappingAll(comments)
                }

            }
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    },

    getCommentById: async (id: string) => {
        try {
            const findComment = await CommentModel.findOne({_id: new ObjectId(id)});

            if (findComment) {

                return {
                    status: ResultCode.Success,
                    data: commentsQueryRepositories._mapping(findComment)
                }
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    },

    _mappingAll: (comments: ICommentDBType[]): ICommentViewModel[] => {
        return comments.map(c => ({
            id: String(c._id),
            commentatorInfo: {...c.commentatorInfo},
            createdAt: c.createdAt,
            content: c.content
        }))
    },

    _mapping: (c: ICommentDBType): ICommentViewModel => {
        return {
            id: String(c._id),
            commentatorInfo: {
              userId: c.commentatorInfo.userId,
              userLogin: c.commentatorInfo.userLogin
            },
            createdAt: c.createdAt,
            content: c.content
        }
    }
}