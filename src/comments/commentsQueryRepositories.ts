import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {createDefaultValuesQueryParams} from "../utils/helper";
import {ObjectId} from "mongodb";
import {ResultCode} from "../types/resultCode";
import {CommentModel} from "./domain/comment.entity";
import {mappingComments} from "../common/utils/mappingComments";

export class CommentsQueryRepositories {
    async getCommentsForSpecialPost(postId: string, queryParams: ICommentsQueryType) {
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
                    items: mappingComments.formatDataAllCommentsForView(comments)
                }

            }
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    }
    async getCommentById(id: string) {
        try {
            const findComment = await CommentModel.findOne({_id: new ObjectId(id)});

            if (findComment) {

                return {
                    status: ResultCode.Success,
                    data: mappingComments.formatDataCommentForView(findComment)
                }
            }
            return {errorMessage: 'Not found comment', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }
    }
}