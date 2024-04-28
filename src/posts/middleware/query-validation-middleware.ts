import {query} from "express-validator";
import {IPostViewModel} from "../types/posts-types";
import {sortDirection} from "../../types/query-params-type";

const validatorQuerySortByPost = query('sortBy').optional().custom(value => {
    const query: Array<keyof IPostViewModel> = ["createdAt", "blogId", "blogName", "content", "title", "shortDescription", "id"]
    return query.includes(value);
}).withMessage('Field incorrect')

const validatorQueryPageNumber = query('pageNumber').optional().isInt().withMessage('Field is incorrect');
const validatorQueryPageSize = query('pageSize').optional().isInt().withMessage('Field is incorrect');
const validatorQuerySearchNameTerm = query('searchNameTerm').optional().isString().withMessage('Field is incorrect');
const validatorQuerySortDirection = query('sortDirection').optional().custom(value => sortDirection.hasOwnProperty(value)).withMessage('Field is incorrect');


export const validationQueryParamsPosts = [validatorQuerySortByPost, validatorQueryPageNumber, validatorQueryPageSize, validatorQuerySearchNameTerm, validatorQuerySortDirection]