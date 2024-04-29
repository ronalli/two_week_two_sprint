import {Router} from "express";
import {authJwtMiddleware} from "../auth/middleware/auth-jwt-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:commentId')
commentsRouter.put('/:commentId', authJwtMiddleware)
commentsRouter.delete('/:commentId', authJwtMiddleware);

