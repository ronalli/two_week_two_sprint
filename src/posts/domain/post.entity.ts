import {HydratedDocument, model, Model, Schema} from "mongoose";
import {ObjectId} from "mongodb";

export interface IPostTypeDB  {
    _id?: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    likesCount: number,
    dislikesCount: number
}

type PostModel = Model<IPostTypeDB>

export type PostDocument = HydratedDocument<IPostTypeDB>

const postSchema = new Schema<IPostTypeDB>({
    title: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    blogId: {
        type: String,
        required: true
    },
    createdAt: String,
    blogName: {
        type: String,
        required: true
    },
    likesCount: {
        type: Number,
        required: true,
        default: 0
    },
    dislikesCount: {
        type: Number,
        required: true,
        default: 0,
    }

})

export const PostModel = model<IPostTypeDB, PostModel>('posts', postSchema)