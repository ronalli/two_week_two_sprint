import {jwtService} from "../../utils/jwt-services";
import {IDecodeRefreshToken} from "../../types/refresh-token-type";

export const decodeToken = async (token: string): Promise<IDecodeRefreshToken | null> => {
    const data = await jwtService.decodeToken(token);

    if(data && typeof data === 'object') {
        return {
            devicedId: data.devicedId,
            iat: new Date(data.iat! * 1000).toISOString(),
            userId: data.userId,
            exp: new Date(data.exp! * 1000).toISOString(),
        }
    }
    return null;
}