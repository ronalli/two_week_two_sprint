import {createDefaultValues} from "../utils/helper";
import {postsCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {IPostDBType, IPostViewModel} from "./types/posts-types";
import {IPostQueryType} from "./types/request-response-type";
import {IPaginator} from "../types/output-paginator";
import {ResultCode} from "../types/resultCode";

export const postsQueryRepositories = {
    getPosts: async (queryParams: IPostQueryType) => {
        const query = createDefaultValues(queryParams);
        try {
            const allPosts = await postsCollection.find()
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();

            const totalCount = await postsCollection.countDocuments();

            return {
                status: ResultCode.Success,
                data: {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount,
                    items: allPosts.map(x => postsQueryRepositories._formatingDataForOutputPost(x))
                }

            }

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    },

    findPostById: async (id: string) => {
        try {
            const foundPost = await postsCollection.findOne({_id: new ObjectId(id)});
            if (foundPost) {
                return {
                    status: ResultCode.Success,
                    data: postsQueryRepositories._formatingDataForOutputPost(foundPost)
                }
            }
            return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    },
    _formatingDataForOutputPost: (input: IPostDBType): IPostViewModel => {
        return {
            id: String(input._id),
            blogId: input.blogId,
            content: input.content,
            createdAt: input.createdAt,
            shortDescription: input.shortDescription,
            blogName: input.blogName,
            title: input.title,
        };
    }
}