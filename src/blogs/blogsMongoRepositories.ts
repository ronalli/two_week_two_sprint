import {blogsCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {IBlogInputModel} from "./types/blogs-types";
import {blogsQueryRepositories} from "./blogsQueryRepositories";
import {ResultCode} from "../types/resultCode";

export const blogsMongoRepositories = {
    create: async (blog: IBlogInputModel) => {
        const newBlog = {
            ...blog,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        try {
            const insertedBlog = await blogsCollection.insertOne(newBlog);
            const foundBlog = await blogsCollection.findOne({_id: insertedBlog.insertedId})
            if (foundBlog) {
                return {
                    status: ResultCode.Created,
                    data: blogsQueryRepositories._formatingDataForOutputBlog(foundBlog)
                }
            }
            return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    },
    update: async (blogId: string, inputUpdateDataBlog: IBlogInputModel) => {
        const {name, websiteUrl, description} = inputUpdateDataBlog
        try {
            const findBlog = await blogsCollection.findOne({_id: new ObjectId(blogId)});
            if (findBlog) {
                await blogsCollection.findOneAndUpdate({_id: new ObjectId(blogId)}, {
                    $set: {
                        name,
                        description,
                        websiteUrl
                    }
                });
                return {status: ResultCode.NotContent, data: null}
            } else {
                return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
            }
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    },
    delete: async (blogId: string) => {
        try {
            const foundBlog = await blogsCollection.findOne({_id: new ObjectId(blogId)});
            if (!foundBlog) {
                return {errorMessage: 'Not found blog', status: ResultCode.NotFound, data: null}
            } else {
                await blogsCollection.findOneAndDelete({_id: new ObjectId(blogId)});
                return {status: ResultCode.NotContent, data: null}
            }
        } catch (e) {
            return {errorMessage: 'Error DB', status: ResultCode.InternalServerError, data: null}
        }
    },
}