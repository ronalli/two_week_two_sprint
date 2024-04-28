import {query} from "express-validator";

enum sortDirection {
    asc = 'asc',
    desc = 'desc'
}

const querySortBy = ['id', 'login', 'email', 'createdAt']

const validatorQuerySortBy = query('sortBy').optional().custom(value => {
    return querySortBy.includes(value)
}).withMessage('Field sortBy incorrect')

const validatorQuerySortDirection = query('sortDirection').optional().custom(value => {
    return sortDirection.hasOwnProperty(value)
}).withMessage('Field sortDirection is incorrect');

const validatorQueryPageNumber = query('pageNumber').optional().isInt().withMessage('Field pageNumber is incorrect');

const validatorQueryPageSize = query('pageSize').optional().isInt().withMessage('Field pageSize is incorrect');

const validatorQuerySearchLoginTerm = query('searchLoginTerm').optional().isString().withMessage('Field searchLoginTerm is incorrect');
const validatorQuerySearchEmailTerm = query('searchEmailTerm').optional().isString().withMessage('Field searchEmailTerm is incorrect');

export const validationQueryUsers = [validatorQuerySortBy, validatorQuerySortDirection, validatorQueryPageNumber, validatorQueryPageSize, validatorQuerySearchLoginTerm,validatorQuerySearchEmailTerm]