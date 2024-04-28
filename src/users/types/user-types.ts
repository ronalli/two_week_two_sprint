import {ObjectId} from "mongodb";

export interface IUserInputModel {
    login: string;
    password: string;
    email: string;
}

export interface IUserViewModel {
    id: string;
    login: string;
    email: string;
    createdAt: string;
}

export interface IUserDBType  {
    _id?: ObjectId;
    login: string;
    email: string;
    hash: string;
    createdAt: string;
}

export interface IPaginatorUserViewModel {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: IUserViewModel[];
}