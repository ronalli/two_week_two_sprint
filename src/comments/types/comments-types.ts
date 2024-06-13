import {ObjectId} from "mongodb";
import {ILikesInfoViewModel} from "./likes-info-types";

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
    likesCount: number
    dislikesCount: number
}

export interface ICommentInputModel {
    content: string
}

export interface ICommentViewModel {
    id: string
    content: string
    commentatorInfo: ICommentatorInfo
    createdAt: string
    likesInfo: ILikesInfoViewModel
}

export interface ICommentAdd {
    postId: string
    userId: string
    content: string
}