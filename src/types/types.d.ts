import {Request, Response} from "express";

declare global {
    namespace Express {
        export interface Request {
            userId: string | null
            login: string | null
        }
        // export interface Response {
        //     userId: string | null
        // }
    }
}