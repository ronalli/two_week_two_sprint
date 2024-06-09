import {body} from 'express-validator'
import {LikeStatus} from "../comments/domain/like.entity";

export const validatorLikeStatus = body('likeStatus').trim().notEmpty().withMessage('This field is empty').custom(value => {
    return LikeStatus.hasOwnProperty(value)
}).withMessage('Field is incorrect');