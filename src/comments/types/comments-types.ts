import {ObjectId} from "mongodb";

interface ICommentatorInfo {
    userId: string
    userLogin: string
}

export interface ICommentDBType {
    _id?: ObjectId
    content: string
    createdAt: string
    commentatorInfo: ICommentatorInfo
}

export interface ICommentInoutModel {
    content: string
}

export interface ICommentViewModel {
    id: string
    content: string
    commentatorInfo: ICommentInoutModel
    createdAt: string
}