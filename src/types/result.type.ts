import {ResultCode} from "./resultCode";

export type Result<T = null> = {
    status: ResultCode,
    errorMessage?: string,
    extensions?: [{
        field: 'id'
        message: ''
    }],
    data: T
}