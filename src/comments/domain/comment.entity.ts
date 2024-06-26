import {HydratedDocument, model, Model, Schema} from "mongoose";


interface ICommentatorInfo {
    userId: string
    userLogin: string
}


export interface ICommentTypeDB {
    content: string
    createdAt: string
    commentatorInfo: ICommentatorInfo
    postId: string
    likesCount: number
    dislikesCount: number
}

type CommentModel = Model<ICommentTypeDB>

export type CommentDocument = HydratedDocument<ICommentTypeDB>

const commentatorInfoSchema = new Schema<ICommentatorInfo>({
    userId: {
        type: String,
        required: true,
    },
    userLogin: {
        type: String,
        required: true,
    }
})


const commentSchema = new Schema<ICommentTypeDB>({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    commentatorInfo: {type: commentatorInfoSchema},
    postId: {
        type: String,
        required: true
    },
    likesCount: {
        type: Number,
        default: 0,
        required: true
    },
    dislikesCount: {
        type: Number,
        default: 0,
        required: true
    }
})

export const CommentModel = model<ICommentTypeDB, CommentModel>('comments', commentSchema)