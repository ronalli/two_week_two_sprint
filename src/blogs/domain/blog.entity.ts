import {HydratedDocument, model, Model, Schema} from "mongoose";

export interface IBlogTypeDB {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

type BlogModel = Model<IBlogTypeDB>;

export type BlogDocument = HydratedDocument<IBlogTypeDB>

const blogSchema = new Schema<IBlogTypeDB>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    websiteUrl: {
        type: String,
        required: true
    },
    createdAt: String,
    isMembership: Boolean
})

export const BlogModel = model<IBlogTypeDB, BlogModel>('blogs', blogSchema)
