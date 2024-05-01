import {ObjectId} from "mongodb";
import {IPaginator} from "../../types/output-paginator";

export interface IPostInputModel {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export interface IPostViewModel {
    id: string
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
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
