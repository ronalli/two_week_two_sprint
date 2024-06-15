import {HydratedDocument, model, Model, Schema} from "mongoose";
import {ILikeTypeDB, LikeStatus} from "../../types/like.status-type";

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
    addedAt: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: LikeStatus,
        default: LikeStatus.None,
        required: true,
    },
    login: {
        type: String,
        required: true,
    }


})

export const LikeModel = model<ILikeTypeDB, LikeModel>('likes', likeSchema);