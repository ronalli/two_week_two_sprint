import {body} from "express-validator";

const validatorLogin = body('login')
    .trim()
    .notEmpty().withMessage('Field is empty')
    .isLength({
        min: 3, max: 10
    }).withMessage('Filed should be min 3 and max 10 symbols').custom(value => {
        const regex = new RegExp('^[a-zA-Z0-9_-]*$');
        return regex.test(value);
    }).withMessage('Field is not correct');

const validatorPassword = body('password').trim()
    .notEmpty().withMessage('Field is empty')
    .isLength({
        min: 6, max: 20
    }).withMessage('Filed should be min 6 and max 20 symbols')

const validatorEmail = body('email').trim()
    .notEmpty().withMessage('Field is empty')
    .matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Field is not correct')

export const validationInputBodyUser = [validatorLogin, validatorPassword, validatorEmail]