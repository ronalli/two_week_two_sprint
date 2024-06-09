import {HydratedDocument, model, Model, Schema} from "mongoose";

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

interface ILikeTypeDB {
    createdAt: string,
    status: LikeStatus;
    userId: string,
    parentId: string
}

type LikeModel = Model<ILikeTypeDB>

export type LikeDocument = HydratedDocument<ILikeTypeDB>

const likeSchema = new Schema<ILikeTypeDB>({
    userId: {
        type: String,
        required: true,
    },
    parentId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(LikeStatus),
        default: LikeStatus.None,
        required: true,
    }
})

export const LikeModel = model<ILikeTypeDB, LikeModel>('likes', likeSchema);