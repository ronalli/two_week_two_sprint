import {ObjectId} from "mongodb";

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

export interface IPaginatorPostViewModel  {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: IPostViewModel[]
}