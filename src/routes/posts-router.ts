import {Router} from 'express';
import {postsControllers} from "../posts/postsControllers";
import {authMiddleware} from "../middleware/auth-middleware";
import {inputCheckCorrectIdMiddleware, inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {validationCreatePost} from "../posts/middleware/input-validation-middleware";
import {validationQueryParamsPosts} from "../posts/middleware/query-validation-middleware";
import {authJwtMiddleware} from "../middleware/auth-jwt-middleware";
import {validationContent} from "../comments/middleware/input-comment-validation-middleware";
import {validatorParamPostId} from "../middleware/postId-validator-middleware";


export const postsRouter = Router({});

postsRouter.get('/', ...validationQueryParamsPosts, inputCheckErrorsMiddleware, postsControllers.getPosts)
postsRouter.get('/:id', validatorParamPostId, inputCheckCorrectIdMiddleware, postsControllers.getPost)
postsRouter.post('/', authMiddleware, ...validationCreatePost, inputCheckErrorsMiddleware, postsControllers.createPost)
postsRouter.put('/:id', authMiddleware, ...validationCreatePost, inputCheckErrorsMiddleware, postsControllers.updatePost)
postsRouter.delete('/:id', authMiddleware, postsControllers.deletePost)

postsRouter.post('/:postId/comments', authJwtMiddleware, validationContent, inputCheckErrorsMiddleware, postsControllers.createCommentForSpecialPost)
postsRouter.get('/:postId/comments', postsControllers.getAllCommentsForPost)