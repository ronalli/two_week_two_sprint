import {SortDirection} from "mongodb";

export interface IPostQueryType {
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: SortDirection,
    searchNameTerm?: string
}