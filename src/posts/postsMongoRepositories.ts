import {postsCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {blogsQueryRepositories} from "../blogs/blogsQueryRepositories";
import {postsQueryRepositories} from "./postsQueryRepositories";
import {IPostDBType, IPostInputModel} from "./types/posts-types";
import {ResultCode} from "../types/resultCode";

export const postsMongoRepositories = {
    create: async (post: IPostInputModel) => {
        const findBlog = await blogsQueryRepositories.findBlogById(post.blogId);
        let newPost: IPostDBType;
        if (findBlog.data) {
            newPost = {
                ...post,
                blogName: findBlog.data.name,
                createdAt: new Date().toISOString(),
            }
            try {
                const insertedPost = await postsCollection.insertOne(newPost);
                const foundPost = await postsCollection.findOne({_id: insertedPost.insertedId});
                if (foundPost) {
                    return {
                        status: ResultCode.Created,
                        data: postsQueryRepositories._formatingDataForOutputPost(foundPost)
                    }
                }
                return {errorMessage: 'Something went wrong', status: ResultCode.BadRequest, data: null}
            } catch (e) {
                return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
            }
        }
        return {errorMessage: 'Not found blog', status: ResultCode.NotFound}
    },
    update: async (id: string, updatePost: IPostInputModel) => {
        try {
            const findPost = await postsCollection.findOne({_id: new ObjectId(id)});
            if (findPost) {
                await postsCollection.findOneAndUpdate({_id: new ObjectId(id)}, {
                    $set: {
                        title: updatePost.title,
                        content: updatePost.content,
                        shortDescription: updatePost.shortDescription,
                        blogId: updatePost.blogId
                    }
                })
                return {status: ResultCode.NotContent, data: null}
            }
            return {errorMessage: 'Something went wrong', status: ResultCode.BadRequest, data: null}
        } catch (e) {
            return {errorMessage: 'Error BD', status: ResultCode.InternalServerError, data: null}
        }

    },
    delete: async (id: string) => {
        const findDeletePost = await postsCollection.findOne({_id: new ObjectId(id)});
        if (findDeletePost) {
            await postsCollection.findOneAndDelete({_id: new ObjectId(id)});
            return {status: ResultCode.NotContent, data: null}
        }
        return {errorMessage: 'Not found post', status: ResultCode.NotFound, data: null}
    },
}