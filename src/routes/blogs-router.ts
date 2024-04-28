import {Router} from 'express';
import {blogsControllers} from "../blogs/blogsControllers";
import {authMiddleware} from "../middleware/auth-middleware";
import {inputCheckCorrectBlogIdMiddleware, inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {validationCreateBlog} from "../blogs/middleware/input-validation-middleware";
import {validatorParamBlogId} from "../blogs/middleware/params-validation-middleware";
import {validationQueryParamsBlogs} from "../blogs/middleware/query-validation-middleware";
import {validationQueryParamsPosts} from "../posts/middleware/query-validation-middleware";
import {validationCreateSpecialPost} from "../posts/middleware/input-validation-middleware";

export const blogsRouter = Router({});

blogsRouter.get('/', ...validationQueryParamsBlogs, inputCheckErrorsMiddleware, blogsControllers.getBlogs)
blogsRouter.get('/:id', blogsControllers.getBlog)
blogsRouter.post('/', authMiddleware, ...validationCreateBlog, inputCheckErrorsMiddleware, blogsControllers.createBlog)
blogsRouter.put('/:id', authMiddleware, ...validationCreateBlog, inputCheckErrorsMiddleware, blogsControllers.updateBlog)
blogsRouter.delete('/:id', authMiddleware, blogsControllers.deleteBlog)

blogsRouter.get('/:blogId/posts',
    ...validationQueryParamsPosts,
    inputCheckErrorsMiddleware,
    validatorParamBlogId,
    inputCheckCorrectBlogIdMiddleware,
    blogsControllers.getAllPostsForBlog)

blogsRouter.post('/:blogId/posts',
    authMiddleware,
    ...validationCreateSpecialPost,
    inputCheckErrorsMiddleware,
    validatorParamBlogId,
    inputCheckCorrectBlogIdMiddleware,
    blogsControllers.createPostForSpecialBlog)