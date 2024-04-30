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
    postId: string
}

export interface ICommentInputModel {
    content: string
}

export interface ICommentViewModel {
    id: string
    content: string
    commentatorInfo: ICommentatorInfo
    createdAt: string
}

export interface ICommentAdd {
    postId: string
    userId: string
    content: string
}