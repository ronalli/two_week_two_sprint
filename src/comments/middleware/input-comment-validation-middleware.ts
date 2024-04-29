import {body} from "express-validator";

export const validationContent = body('content')
    .trim().notEmpty().withMessage('This field is empty')
    .isLength({min: 20, max: 300}).withMessage('Filed should be min 20 and max 300 symbol')

