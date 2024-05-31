import {HydratedDocument, model, Model, Schema} from "mongoose";

export interface IPostTypeDB  {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
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
    }
})

export const PostModel = model<IPostTypeDB, PostModel>('posts', postSchema)