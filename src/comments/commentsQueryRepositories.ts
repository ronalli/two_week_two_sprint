import {commentsCollection} from "../db/mongo-db";
import {ICommentDBType, ICommentViewModel} from "./types/comments-types";
import {ICommentsQueryType} from "./types/output-paginator-comments-types";
import {createDefaultValuesQueryParams} from "../utils/helper";

export const commentsQueryRepositories = {
    getCommentsForSpecialPost: async (postId: string, queryParams: ICommentsQueryType) => {

        const query = createDefaultValuesQueryParams(queryParams);

        console.log(query)

        try {
            const filter = {postId: postId}
            const comments =  await commentsCollection.find(filter)
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();
            const totalCount = await commentsCollection.countDocuments(filter);

            return {
                pagesCount: Math.ceil(totalCount/ query.pageSize),
                pageSize: query.pageSize,
                page: query.pageNumber,
                totalCount,
                items: commentsQueryRepositories._mapping(comments)
            }
        } catch (e) {
            return [];
        }
    },

    _mapping: (comments: ICommentDBType[]): ICommentViewModel[] => {
        return comments.map(c => ({
            id: String(c._id),
            commentatorInfo: {...c.commentatorInfo},
            createdAt: c.createdAt,
            content: c.content
        }))
    }
}