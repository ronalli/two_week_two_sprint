import {SortDirection} from "mongodb";

export enum sortDirection {
    asc = 'asc',
    desc = 'desc'
}

//сделать универсальным (pageNumber, pageSize, sortBy, sortDirection) -
// остальное наследовать и дополнять в каждом сервисе

export interface IQueryType {
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: SortDirection,
    searchNameTerm?: string
}

export interface IMainQueryType {
    pageNumber?: number,
    pageSize?: number,
    sortBy?: string,
    sortDirection?: SortDirection,
}