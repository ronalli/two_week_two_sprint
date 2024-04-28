import {SortDirection} from "mongodb";

export enum sortDirection {
    asc = 'asc',
    desc = 'desc'
}

export interface IQueryType {
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: SortDirection,
    searchNameTerm?: string
}