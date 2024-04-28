import {query} from "express-validator";
import {IBlogViewModel} from "../types/blogs-types";
import {sortDirection} from "../../types/query-params-type";

const validatorQuerySortByBlogs = query('sortBy').optional().custom(value => {
    const query: Array<keyof IBlogViewModel> = ["createdAt", "description", "id", "isMembership", "name", "websiteUrl"]
    return query.includes(value);
}).withMessage('Field sortBy incorrect')

const validatorQueryPageNumber = query('pageNumber').optional().isInt().withMessage('Field pageNumber is incorrect');
const validatorQueryPageSize = query('pageSize').optional().isInt().withMessage('Field pageSize is incorrect');
const validatorQuerySearchNameTerm = query('searchNameTerm').optional().isString().withMessage('Field pageSize is incorrect');
const validatorQuerySortDirection = query('sortDirection').optional().custom(value => sortDirection.hasOwnProperty(value)).withMessage('Field sortDirection is incorrect');


export const validationQueryParamsBlogs = [validatorQuerySortByBlogs, validatorQueryPageNumber, validatorQueryPageSize, validatorQuerySearchNameTerm, validatorQuerySortDirection]