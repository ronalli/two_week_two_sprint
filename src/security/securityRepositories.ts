
import {ResultCode} from "../types/resultCode";
import {IDecodeRefreshToken} from "../types/refresh-token-type";
import {DeviceModel} from "./domain/device.entity";

export const securityRepositories = {
    deleteDevice: async (iat: string, deviceId: string) => {

        try {

            const success = await DeviceModel.deleteOne({iat: iat, deviceId: deviceId})

            return {
                status: ResultCode.NotContent, data: null
            }

        } catch (e) {
            return {
                status: ResultCode.InternalServerError,
                data: null,
                errorsMessage: [{
                    message: 'Error DB',
                    field: 'db'
                }]
            }
        }

    },

    deleteDevicesButCurrent: async (data: IDecodeRefreshToken) => {
        const {iat, userId, deviceId} = data;

        try {
            const currentDevice = await DeviceModel.findOne({iat: iat})

            await DeviceModel.deleteMany({userId: userId, _id: {$ne: currentDevice?._id}})

            return {
                status: ResultCode.NotContent,
                data: null
            }
        } catch (e) {
            return {
                status: ResultCode.InternalServerError,
                data: null,
                errorsMessage: [{
                    message: 'Error DB',
                    field: 'db'
                }]
            }
        }

    },

    getDevice: async (deviceId: string) => {
        try {

            const res = await DeviceModel.findOne({deviceId: deviceId})


            return {
                status: ResultCode.Success,
                data: res
            }
        } catch (e) {
            return {
                status: ResultCode.InternalServerError,
                errorsMessage: [
                    {
                        message: 'Error DB',
                        field: 'token'
                    }
                ]
            }
        }

    },

    updateDevice: async (data: IDecodeRefreshToken) => {

        const {iat, deviceId, userId, exp} = data;

        const currentDevice = await DeviceModel.findOne({$and: [{deviceId: deviceId}, {userId: userId}]})

        if(!currentDevice) {
            return {
                status: ResultCode.NotFound,
                data: null,
                errorsMessage: [{
                    message: 'Error device',
                    field: 'deviceId'
                }]
            }
        }

        currentDevice.iat = iat;
        currentDevice.exp = exp;

        await currentDevice.save();

        return currentDevice;

    }
}