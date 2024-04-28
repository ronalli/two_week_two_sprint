import {blogsCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {IBlogInputModel} from "./types/blogs-types";
import {blogsQueryRepositories} from "./blogsQueryRepositories";

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
                return blogsQueryRepositories._formatingDataForOutputBlog(foundBlog)
            }
            return;
        } catch (e) {
            console.log(e)
            return;
        }
    },
    update: async (id: string, inputUpdateDataBlog: IBlogInputModel) => {
        const {name, websiteUrl, description} = inputUpdateDataBlog
        try {
            const findBlog = await blogsCollection.findOne({_id: new ObjectId(id)});
            if (findBlog) {
                await blogsCollection.findOneAndUpdate({_id: new ObjectId(id)}, {
                    $set: {
                        name,
                        description,
                        websiteUrl
                    }
                });
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    delete: async (id: string) => {
        try {
            const flag = await blogsCollection.findOne({_id: new ObjectId(id)});
            if (!flag) {
                return false;
            } else {
                await blogsCollection.findOneAndDelete({_id: new ObjectId(id)});
                return true;
            }
        } catch (e) {
            console.log(e)
            return;
        }
    },
}