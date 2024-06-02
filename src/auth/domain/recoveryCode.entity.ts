import {HydratedDocument, model, Model, Schema} from "mongoose";

export interface IRecoveryCodeTypeDB {
    code: string
}

type RecoveryCodeModel = Model<IRecoveryCodeTypeDB>

export type RecoveryCodeDocument = HydratedDocument<IRecoveryCodeTypeDB>;

const recoveryCodeSchema = new Schema<IRecoveryCodeTypeDB>({
    code: {
        type: String,
        required: true
    },
})

export const RecoveryCodeModel = model<IRecoveryCodeTypeDB, RecoveryCodeModel>('recoveryCodes', recoveryCodeSchema)