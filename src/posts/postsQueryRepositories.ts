import {createDefaultValues} from "../utils/helper";
import {postsCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {IPaginatorPostViewModel, IPostDBType, IPostViewModel} from "./types/posts-types";
import {IPostQueryType} from "./types/request-response-type";

export const postsQueryRepositories = {
    getPosts: async (queryParams: IPostQueryType): Promise<IPaginatorPostViewModel | []> => {
        const query = createDefaultValues(queryParams);
        try {
            const allPosts = await postsCollection.find()
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();

            const totalCount = await postsCollection.countDocuments();

            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount,
                items: allPosts.map(x => postsQueryRepositories._formatingDataForOutputPost(x))
            }

        } catch (error) {
            console.log(error);
            return []
        }
    },

    findPostById: async (id: string) => {
        try {
            const foundPost = await postsCollection.findOne({_id: new ObjectId(id)});
            if (foundPost) {
                return postsQueryRepositories._formatingDataForOutputPost(foundPost);
            }
            return;
        } catch (e) {
            return;
        }
    },
    _formatingDataForOutputPost : (input: IPostDBType): IPostViewModel => {
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