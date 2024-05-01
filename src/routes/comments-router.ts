import {Router} from "express";
import {authJwtMiddleware} from "../middleware/auth-jwt-middleware";
import {commentsController} from "../comments/commentsControllers";
import {validationContent} from "../comments/middleware/input-comment-validation-middleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";

export const commentsRouter = Router({})

commentsRouter.get('/:commentId', commentsController.getComment)
commentsRouter.put('/:commentId', authJwtMiddleware, validationContent, inputCheckErrorsMiddleware, commentsController.updateComment)
commentsRouter.delete('/:commentId', authJwtMiddleware);

