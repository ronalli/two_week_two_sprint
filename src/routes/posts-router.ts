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

postsRouter.get('/', ...validationQueryParamsPosts, inputCheckErrorsMiddleware, postsControllers.getPosts.bind(postsControllers));
postsRouter.get('/:id', validatorParamPostId, inputCheckCorrectIdMiddleware, postsControllers.getPost.bind(postsControllers))
postsRouter.post('/', authMiddleware, ...validationCreatePost, inputCheckErrorsMiddleware, postsControllers.createPost.bind(postsControllers))
postsRouter.put('/:id', authMiddleware, ...validationCreatePost, inputCheckErrorsMiddleware, postsControllers.updatePost.bind(postsControllers))
postsRouter.delete('/:id', authMiddleware, postsControllers.deletePost.bind(postsControllers))
postsRouter.post('/:postId/comments', authJwtMiddleware, validationContent, inputCheckErrorsMiddleware, postsControllers.createCommentForSpecialPost.bind(postsControllers))
postsRouter.get('/:postId/comments', postsControllers.getAllCommentsForPost.bind(postsControllers))