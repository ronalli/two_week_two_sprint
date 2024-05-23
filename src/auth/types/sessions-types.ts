export interface ISessionType {
    userId: string,
    devicedId: string,
    iat: string,
    deviceName: string,
    ip: string,
    exp: string
}

export interface IHeadersSession {
    deviceName: string,
    ip: string,
}