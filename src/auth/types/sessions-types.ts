import {ObjectId} from "mongodb";

export interface ISessionType {
    _id?: ObjectId,
    userId: string,
    devicedId: string,
    iat: string,
    deviceName: string,
    ip: string,
    exp: string
}

export interface IDeviceViewModel {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string,
}

export interface IHeadersSession {
    deviceName: string,
    ip: string,
}