import {body} from 'express-validator'
import {LikeStatus} from "../types/like.status-type";

export const validatorLikeStatus = body('likeStatus').trim().notEmpty().withMessage('This field is empty').custom(value => {
    return LikeStatus.hasOwnProperty(value)
}).withMessage('Field is incorrect');