import {body} from "express-validator";

export const validationCode = body('code').trim().notEmpty().withMessage('Field is empty').isLength({min: 1}).withMessage('Field is empty')