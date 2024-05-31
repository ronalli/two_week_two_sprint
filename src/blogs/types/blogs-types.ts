import {ObjectId} from "mongodb";

export interface IBlogInputModel {
    name: string,
    description: string,
    websiteUrl: string
}

export interface IBlogViewModel  {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

export interface IBlogDBType {
    _id?: ObjectId
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}