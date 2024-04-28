import {SortDirection} from "mongodb";

export interface IUserQueryType {
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: SortDirection,
    searchLoginTerm?: string,
    searchEmailTerm?: string
}