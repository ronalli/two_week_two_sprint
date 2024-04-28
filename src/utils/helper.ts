import {SortDirection} from "mongodb";
import {IQueryType} from "../types/query-params-type";

export const createDefaultValues = (query: IQueryType) => {
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : "createdAt",
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : "desc",
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
    }
}