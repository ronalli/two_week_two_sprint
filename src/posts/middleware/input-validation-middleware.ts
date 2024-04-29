import {body} from 'express-validator'
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

const validationBlogId = body('blogId')
    .trim().notEmpty().withMessage('Field is empty')
    .isString()
    .withMessage('Field is not correct type')
    .custom(
        async value => {
            const isValidBlogId = await blogsQueryRepositories.findBlogById(value);
            if(!isValidBlogId) {
                throw new Error('Field is incorrect')
            }
            return true;
        })

export const validationCreatePost = [validationBlogId, validationTitle, validationShortDescription, validationContent];

export const validationCreateSpecialPost = [validationTitle, validationShortDescription, validationContent];