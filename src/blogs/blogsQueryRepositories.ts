import {createDefaultValues} from "../utils/helper";
import {blogsCollection, postsCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {IBlogQueryType} from "./types/request-response-type";
import {IBlogDBType, IBlogViewModel} from "./types/blogs-types";
import {IPostDBType, IPostViewModel} from "../posts/types/posts-types";
import {ResultCode} from "../types/resultCode";


export const blogsQueryRepositories = {

    getAndSortPostsSpecialBlog: async (blogId: string, queryParams: IBlogQueryType) => {

        const query = createDefaultValues(queryParams);

        const search = query.searchNameTerm ?
            {title: {$regex: query.searchNameTerm, $options: "i"}} : {}

        const filter = {
            blogId,
            ...search
        }

        try {
            const allPosts = await postsCollection
                .find(filter)
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();


            const totalCount = await postsCollection.countDocuments(filter);

            return {
                status: ResultCode.Success,
                data: {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount,
                    items: allPosts.map(x => blogsQueryRepositories._formatingDataForOutputPost(x))
                }
            }

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    },

    getAllBlogs: async (queryParams: IBlogQueryType) => {
        const query = createDefaultValues(queryParams);

        const search = query.searchNameTerm ?
            {name: {$regex: `${query.searchNameTerm}`, $options: "i"}} : {}

        const filter = {
            ...search
        }

        try {
            const allBlogs = await blogsCollection
                .find(filter)
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray();


            const totalCount = await blogsCollection.countDocuments(filter);

            return {
                status: ResultCode.Success,
                data: {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount,
                    items: allBlogs.map(x => blogsQueryRepositories._formatingDataForOutputBlog(x))
                }
            }
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    },
    findBlogById: async (blogId: string) => {
        try {
            const foundBlog = await blogsCollection.findOne({_id: new ObjectId(blogId)});
            if (foundBlog) {

                return {
                    status: ResultCode.Success,
                    data: blogsQueryRepositories._formatingDataForOutputBlog(foundBlog)
                }
            }
            return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }

    },
    _formatingDataForOutputBlog: (input: IBlogDBType): IBlogViewModel => {
        return {
            id: String(input._id),
            name: input.name,
            description: input.description,
            websiteUrl: input.websiteUrl,
            createdAt: input.createdAt,
            isMembership: input.isMembership,
        };
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
