import {Router} from "express";
import {authJwtMiddleware} from "../middleware/auth-jwt-middleware";
import {commentsController} from "../comments/commentsControllers";

export const commentsRouter = Router({})

commentsRouter.get('/:commentId', commentsController.getComment)
commentsRouter.put('/:commentId', authJwtMiddleware)
commentsRouter.delete('/:commentId', authJwtMiddleware);

