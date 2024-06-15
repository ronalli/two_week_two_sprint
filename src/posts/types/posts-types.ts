import {ObjectId} from "mongodb";
import {LikeStatus} from "../../types/like.status-type";

export interface IPostInputModel {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export interface INewLike {
    addedAt: string,
    userId: string,
    login: string
}

export interface IPostExtendedLikesInfo {
    likesCount: number,
    dislikesCount: number,
    myStatus: string,
    newestLikes: INewLike[],
}


export interface IPostViewModel {
    id: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: IPostExtendedLikesInfo
}

export interface IPostDBType  {
    _id?: ObjectId
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
}
