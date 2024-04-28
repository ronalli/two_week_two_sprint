import {Router} from 'express';
import {postsControllers} from "../posts/postsControllers";
import {authMiddleware} from "../middleware/auth-middleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {validationCreatePost} from "../posts/middleware/input-validation-middleware";
import {validationQueryParamsPosts} from "../posts/middleware/query-validation-middleware";


export const postsRouter = Router({});

postsRouter.get('/', ...validationQueryParamsPosts, inputCheckErrorsMiddleware, postsControllers.getPosts)
postsRouter.get('/:id', postsControllers.getPost)
postsRouter.post('/', authMiddleware, ...validationCreatePost, inputCheckErrorsMiddleware, postsControllers.createPost)
postsRouter.put('/:id', authMiddleware, ...validationCreatePost, inputCheckErrorsMiddleware, postsControllers.updatePost)
postsRouter.delete('/:id', authMiddleware, postsControllers.deletePost)