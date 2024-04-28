import {ObjectId} from "mongodb";

interface ICommentatorInfo {
    userId: string
    userLogin: string
}

export interface ICommentsDBType {
    _id?: ObjectId
    content: string
    createdAt: string
    commentatorInfo: ICommentatorInfo
}