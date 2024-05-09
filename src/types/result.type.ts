import {ResultCode} from "./resultCode";

export type Result<T = null> = {
    status: ResultCode,
    errorMessage?: string,
    extensions?: [{
        field: string
        message: string
    }],
    data: T
}