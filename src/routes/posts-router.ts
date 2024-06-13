import {Router} from 'express';
import {authMiddleware} from "../middleware/auth-middleware";
import {inputCheckCorrectIdMiddleware, inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {validationCreatePost} from "../posts/middleware/input-validation-middleware";
import {validationQueryParamsPosts} from "../posts/middleware/query-validation-middleware";
import {validationContent} from "../comments/middleware/input-comment-validation-middleware";
import {validatorParamPostId} from "../middleware/postId-validator-middleware";
import {authJwtMiddleware} from "../middleware/auth-jwt-middleware";
import {container} from "../composition-root";
import {PostsController} from "../posts/postsController";

const postsController = container.resolve(PostsController);

export const postsRouter = Router({});

postsRouter.get('/', ...validationQueryParamsPosts, inputCheckErrorsMiddleware, postsController.getPosts.bind(postsController));
postsRouter.get('/:id', validatorParamPostId, inputCheckCorrectIdMiddleware, postsController.getPost.bind(postsController))
postsRouter.post('/', authMiddleware, ...validationCreatePost, inputCheckErrorsMiddleware, postsController.createPost.bind(postsController))
postsRouter.put('/:id', authMiddleware, ...validationCreatePost, inputCheckErrorsMiddleware, postsController.updatePost.bind(postsController))
postsRouter.delete('/:id', authMiddleware, postsController.deletePost.bind(postsController))
postsRouter.post('/:postId/comments', authJwtMiddleware, validationContent, inputCheckErrorsMiddleware, postsController.createCommentForSpecialPost.bind(postsController))
postsRouter.get('/:postId/comments', postsController.getAllCommentsForPost.bind(postsController))