import {createDefaultValues} from "../utils/helper";
import {ObjectId} from "mongodb";
import {IBlogQueryType} from "./types/request-response-type";
import {ResultCode} from "../types/resultCode";
import {BlogModel} from "./domain/blog.entity";
import {PostModel} from "../posts/domain/post.entity";
import {mappingBlogs} from "../common/utils/mappingBlogs";
import {mappingPosts} from "../common/utils/mappingPosts";


export class BlogsQueryRepositories {
    async getAndSortPostsSpecialBlog(blogId: string, queryParams: IBlogQueryType) {
        const query = createDefaultValues(queryParams);

        const search = query.searchNameTerm ?
            {title: {$regex: query.searchNameTerm, $options: "i"}} : {}

        const filter = {
            blogId,
            ...search
        }

        try {
            const allPosts = await PostModel
                .find(filter)
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)


            const totalCount = await PostModel.countDocuments(filter);

            return {
                status: ResultCode.Success,
                data: {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount,
                    items: allPosts.map(x => mappingPosts.formatingDataForOutputPost(x))
                }
            }

        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }
    async getAllBlogs(queryParams: IBlogQueryType){
        const query = createDefaultValues(queryParams);

        const search = query.searchNameTerm ?
            {name: {$regex: `${query.searchNameTerm}`, $options: "i"}} : {}

        const filter = {
            ...search
        }

        try {

            const allBlogs = await BlogModel
                .find(filter)
                .sort({[query.sortBy]: query.sortDirection})
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)


            const totalCount = await BlogModel.countDocuments(filter);

            return {
                status: ResultCode.Success,
                data: {
                    pagesCount: Math.ceil(totalCount / query.pageSize),
                    page: query.pageNumber,
                    pageSize: query.pageSize,
                    totalCount,
                    items: allBlogs.map(x => mappingBlogs.formatingDataForOutputBlog(x))
                }
            }
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }
    async findBlogById(blogId: string){
        try {
            const foundBlog = await BlogModel.findOne({_id: new ObjectId(blogId)});
            if (foundBlog) {

                return {
                    status: ResultCode.Success,
                    data: mappingBlogs.formatingDataForOutputBlog(foundBlog)
                }
            }
            return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }

    }
}
