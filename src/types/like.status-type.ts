import {ObjectId} from "mongodb";

export enum LikeStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}

export interface ILikeTypeDB {
    addedAt: string,
    status: LikeStatus,
    userId: string,
    parentId: string,
    login: string,
}