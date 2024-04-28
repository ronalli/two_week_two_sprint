import {body} from "express-validator";

const validatorLoginOrEmail = body('loginOrEmail').trim()
    .notEmpty().withMessage('Field is empty')
    .isString().withMessage('Field is not correct')

const validatorPassword = body('password').trim()
    .notEmpty().withMessage('Field is empty')
    .isString().withMessage('Field is not correct')


export const validationInputAuth = [validatorLoginOrEmail, validatorPassword]