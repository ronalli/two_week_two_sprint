import {HydratedDocument, model, Model, Schema} from "mongoose";

export interface IRateLimitType {
    ip: string,
    url: string,
    date: number
}

type RateLimitModel = Model<IRateLimitType>;

export type RateLimitDocument = HydratedDocument<IRateLimitType>;

const rateLimitSchema = new Schema<IRateLimitType>({
    date: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    }
})

export const RateLimitModel = model<IRateLimitType, RateLimitModel>("rateLimit", rateLimitSchema);