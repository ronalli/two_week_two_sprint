import {param} from "express-validator";

export const validatorParamPostId = param("id").isMongoId().withMessage('Not found')
