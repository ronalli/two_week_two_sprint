import {IDeviceViewModel, ISessionType} from "../../auth/types/sessions-types";

export const mappingSessions = (data: ISessionType[]): IDeviceViewModel[] => {
        return data.map(deviceDB => {
            return {
                ip: deviceDB.ip,
                title: deviceDB.deviceName,
                lastActiveDate: deviceDB.iat,
                deviceId: deviceDB.devicedId,
            }
        })
}