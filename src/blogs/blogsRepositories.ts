import {ObjectId} from "mongodb";
import {IBlogInputModel} from "./types/blogs-types";
import {ResultCode} from "../types/resultCode";
import {BlogModel} from "./domain/blog.entity";
import {mappingBlogs} from "../common/utils/mappingBlogs";

export class BlogsRepositories {
    async create(blog: IBlogInputModel){
        const blogData = {
            ...blog,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        try {

            const blog = new BlogModel(blogData);
            const response = await blog.save();

            const foundBlog = await BlogModel.findOne({_id: response._id})
            if (foundBlog) {
                return {
                    status: ResultCode.Created,
                    data: mappingBlogs.formatingDataForOutputBlog(foundBlog)
                }
            }
            return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }
    async update(blogId: string, inputUpdateDataBlog: IBlogInputModel){
        const {name, websiteUrl, description} = inputUpdateDataBlog
        try {
            const findBlog = await BlogModel.findOne({_id: new ObjectId(blogId)});
            if (findBlog) {

                findBlog.name = name;
                findBlog.description = description;
                findBlog.websiteUrl = websiteUrl;

                await findBlog.save();

                return {status: ResultCode.NotContent, data: null}
            } else {
                return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
            }
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }
    async delete(blogId: string){
        try {
            const foundBlog = await BlogModel.findOne({_id: new ObjectId(blogId)});

            if (!foundBlog) {
                return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
            } else {
                await BlogModel.deleteOne({_id: new ObjectId(blogId)});
                return {status: ResultCode.NotContent, data: null}
            }
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    }
}