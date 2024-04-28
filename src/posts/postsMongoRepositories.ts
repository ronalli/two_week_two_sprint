import {postsCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {blogsQueryRepositories} from "../blogs/blogsQueryRepositories";
import {postsQueryRepositories} from "./postsQueryRepositories";
import {IPostDBType, IPostInputModel} from "./types/posts-types";

export const postsMongoRepositories = {
    create: async (post: IPostInputModel) => {
        const findBlog = await blogsQueryRepositories.findBlogById(post.blogId);
        let newPost: IPostDBType;
        if (findBlog) {
            newPost = {
                ...post,
                blogName: findBlog.name,
                createdAt: new Date().toISOString(),
            }
            try {
                const insertedPost = await postsCollection.insertOne(newPost);
                const foundPost = await postsCollection.findOne({_id: insertedPost.insertedId});
                if (foundPost) {
                    return postsQueryRepositories._formatingDataForOutputPost(foundPost);
                }
                return;
            } catch (e) {
                return;
            }
        }
        return false;
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
                return true;
            }
            return false;
        } catch (e) {
            return;
        }

    },
    delete: async (id: string) => {
        const findDeletePost = await postsCollection.findOne({_id: new ObjectId(id)});
        if (findDeletePost) {
            await postsCollection.findOneAndDelete({_id: new ObjectId(id)});
            return true;
        }
        return false;
    },
}