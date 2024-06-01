
import {HydratedDocument, model, Model, Schema} from "mongoose";


export interface IRefreshTokenTypeDB {
    refreshToken: string,
}


type RefreshTokenModel = Model<IRefreshTokenTypeDB>

export type RefreshTokenDocument = HydratedDocument<IRefreshTokenTypeDB>

const refreshTokenSchema = new Schema<IRefreshTokenTypeDB>({
    refreshToken: {
        type: String,
        required: true,
    }
})


export const RefreshTokenModel = model<IRefreshTokenTypeDB, RefreshTokenModel>('oldTokens', refreshTokenSchema)