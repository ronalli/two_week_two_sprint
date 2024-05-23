import {jwtService} from "../../utils/jwt-services";

export const decodeToken = async (token: string) => {
    const data = await jwtService.decodeToken(token);

    if(data && typeof data === 'object') {
        return {
            devicedId: data.deviceId,
            iat: new Date(data.iat! * 1000).toISOString(),
            userId: data.userId,
            exp: new Date(data.exp! * 1000).toISOString(),
        }
    }
    return null;
}