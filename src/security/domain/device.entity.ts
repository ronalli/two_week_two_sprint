import {HydratedDocument, model, Model, Schema} from "mongoose";

export interface IDeviceType {
    userId: string,
    deviceId: string,
    iat: string,
    deviceName: string,
    ip: string,
    exp: string
}

type DeviceModel = Model<IDeviceType>;

export type DeviceDocument = HydratedDocument<IDeviceType>;

const deviceSchema = new Schema<IDeviceType>({
    deviceId: {
        type: String,
        required: true,
    },
    deviceName: {
        type: String,
        required: true,
    },
    exp: {
        type: String,
        required: true,
    },
    iat: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
})

export const DeviceModel = model<IDeviceType, DeviceModel>('devices', deviceSchema);