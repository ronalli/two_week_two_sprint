import {Router} from 'express';
import {blogsControllers} from "../blogs/blogsControllers";
import {authMiddleware} from "../middleware/auth-middleware";
import {inputCheckCorrectIdMiddleware, inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {validationCreateBlog} from "../blogs/middleware/input-validation-middleware";
import {validationQueryParamsBlogs} from "../blogs/middleware/query-validation-middleware";
import {validationQueryParamsPosts} from "../posts/middleware/query-validation-middleware";
import {validationCreateSpecialPost} from "../posts/middleware/input-validation-middleware";
import {validatorParamBlogId} from "../middleware/blogId-validator-middleware";

export const blogsRouter = Router({});

blogsRouter.get('/', ...validationQueryParamsBlogs, inputCheckErrorsMiddleware, blogsControllers.getBlogs.bind(blogsControllers))

blogsRouter.get('/:blogId', validatorParamBlogId, inputCheckCorrectIdMiddleware, blogsControllers.getBlog.bind(blogsControllers))

blogsRouter.post('/',
    authMiddleware,
    ...validationCreateBlog,
    inputCheckErrorsMiddleware,
    blogsControllers.createBlog.bind(blogsControllers))

blogsRouter.put('/:blogId',
    authMiddleware,
    validatorParamBlogId,
    inputCheckCorrectIdMiddleware,
    ...validationCreateBlog,
    inputCheckErrorsMiddleware,
    blogsControllers.updateBlog.bind(blogsControllers))

blogsRouter.delete('/:blogId', authMiddleware, blogsControllers.deleteBlog.bind(blogsControllers))

blogsRouter.get('/:blogId/posts',
    ...validationQueryParamsPosts,
    inputCheckErrorsMiddleware,
    validatorParamBlogId,
    inputCheckCorrectIdMiddleware,
    blogsControllers.getAllPostsForBlog.bind(blogsControllers))

blogsRouter.post('/:blogId/posts',
    authMiddleware,
    ...validationCreateSpecialPost,
    inputCheckErrorsMiddleware,
    validatorParamBlogId,
    inputCheckCorrectIdMiddleware,
    blogsControllers.createPostForSpecialBlog.bind(blogsControllers))