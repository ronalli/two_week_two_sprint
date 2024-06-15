import {Router} from "express";
import {validationContent} from "../comments/middleware/input-comment-validation-middleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {authJwtMiddleware} from "../middleware/auth-jwt-middleware";
import {validatorLikeStatus} from "../middleware/like-status-middleware";
import {container} from "../composition-root";
import {CommentsController} from "../comments/commentsController";

const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router({})

commentsRouter.get('/:commentId', commentsController.getComment.bind(commentsController))
commentsRouter.put('/:commentId', authJwtMiddleware, validationContent, inputCheckErrorsMiddleware, commentsController.updateComment.bind(commentsController))
commentsRouter.delete('/:commentId', authJwtMiddleware, commentsController.deleteComment.bind(commentsController));
commentsRouter.put('/:commentId/like-status', authJwtMiddleware, validatorLikeStatus,  inputCheckErrorsMiddleware, commentsController.updateLikeStatusForSpecialComment.bind(commentsController));

