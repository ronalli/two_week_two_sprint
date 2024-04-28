import {SortDirection} from "mongodb";

export interface IBlogQueryType {
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: SortDirection,
    searchNameTerm?: string
}