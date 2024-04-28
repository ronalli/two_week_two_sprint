import {param} from "express-validator";

export const validatorParamBlogId = param("blogId").isMongoId().withMessage('Field is incorrect');