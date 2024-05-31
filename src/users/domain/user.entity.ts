import {HydratedDocument, model, Model, Schema} from "mongoose";

type emailConfirmationType = {
    confirmationCode: string | null
    expirationDate: Date | null
    isConfirmed?: boolean
}

export interface IUserTypeDB {
    login: string
    email: string
    hash: string
    createdAt: string
    emailConfirmation?: emailConfirmationType
}

type UserModel = Model<IUserTypeDB>;

export type AuthDocument = HydratedDocument<IUserTypeDB>;

const emailConfirmationSchema =  new Schema<emailConfirmationType>({
    confirmationCode: {
        type: String,
        default: null
    },
    expirationDate: {
        type: Date,
        default: null
    },
    isConfirmed: {type: Boolean, default: true},
})

const userSchema = new Schema<IUserTypeDB>({
    login: String,
    email: String,
    hash: String,
    createdAt: String,
    emailConfirmation: { type: emailConfirmationSchema}
})

export const UserModel = model<IUserTypeDB, UserModel>('users', userSchema);