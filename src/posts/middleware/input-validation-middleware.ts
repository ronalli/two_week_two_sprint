import {body, param} from 'express-validator'
import {blogsQueryRepositories} from "../../blogs/blogsQueryRepositories";

const validationTitle = body('title')
    .trim().notEmpty().withMessage('Field is empty')
    .isLength({max: 30}).withMessage('Filed should be max 30 symbols');

const validationShortDescription = body('shortDescription')
    .trim().notEmpty().withMessage('Field shortDescription is empty')
    .isLength({max: 100}).withMessage('Filed should be max 100 symbols');

const validationContent = body('content')
    .trim().notEmpty().withMessage('Field is empty')
    .isLength({max: 1000}).withMessage('Filed should be max 1000 symbols')

export const validatorBlogId = body("blogId").custom(async id => {
    const isValid = await blogsQueryRepositories.findBlogById(id)
    if(!isValid.data) {
        throw new Error('Field is incorrect')
    }
    return true;
})

export const validationCreatePost = [validationTitle, validationShortDescription, validationContent, validatorBlogId];

export const validationCreateSpecialPost = [validationTitle, validationShortDescription, validationContent];