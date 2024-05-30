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
    userId: String,
    deviceId: String,
    iat: String,
    deviceName: String,
    ip: String,
    exp: String,
})

export const DeviceModel = model<IDeviceType, DeviceModel>('devices', deviceSchema);