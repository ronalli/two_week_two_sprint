import {Router} from "express";
import {validationContent} from "../comments/middleware/input-comment-validation-middleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {commentsController} from "../composition-root";
import {authJwtMiddleware} from "../middleware/auth-jwt-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:commentId', commentsController.getComment.bind(commentsController))
commentsRouter.put('/:commentId', authJwtMiddleware, validationContent, inputCheckErrorsMiddleware, commentsController.updateComment.bind(commentsController))
commentsRouter.delete('/:commentId', authJwtMiddleware, commentsController.deleteComment.bind(commentsController));

