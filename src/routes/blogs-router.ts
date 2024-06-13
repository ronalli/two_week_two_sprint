import {Router} from 'express';
import {authMiddleware} from "../middleware/auth-middleware";
import {inputCheckCorrectIdMiddleware, inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {validationCreateBlog} from "../blogs/middleware/input-validation-middleware";
import {validationQueryParamsBlogs} from "../blogs/middleware/query-validation-middleware";
import {validationQueryParamsPosts} from "../posts/middleware/query-validation-middleware";
import {validationCreateSpecialPost} from "../posts/middleware/input-validation-middleware";
import {validatorParamBlogId} from "../middleware/blogId-validator-middleware";
import {container} from "../composition-root";
import {BlogsController} from "../blogs/blogsController";

const blogsController = container.resolve(BlogsController);

export const blogsRouter = Router({});

blogsRouter.get('/', ...validationQueryParamsBlogs, inputCheckErrorsMiddleware, blogsController.getBlogs.bind(blogsController))

blogsRouter.get('/:blogId', validatorParamBlogId, inputCheckCorrectIdMiddleware, blogsController.getBlog.bind(blogsController))

blogsRouter.post('/',
    authMiddleware,
    ...validationCreateBlog,
    inputCheckErrorsMiddleware,
    blogsController.createBlog.bind(blogsController))

blogsRouter.put('/:blogId',
    authMiddleware,
    validatorParamBlogId,
    inputCheckCorrectIdMiddleware,
    ...validationCreateBlog,
    inputCheckErrorsMiddleware,
    blogsController.updateBlog.bind(blogsController))

blogsRouter.delete('/:blogId', authMiddleware, blogsController.deleteBlog.bind(blogsController))

blogsRouter.get('/:blogId/posts',
    ...validationQueryParamsPosts,
    inputCheckErrorsMiddleware,
    validatorParamBlogId,
    inputCheckCorrectIdMiddleware,
    blogsController.getAllPostsForBlog.bind(blogsController))

blogsRouter.post('/:blogId/posts',
    authMiddleware,
    ...validationCreateSpecialPost,
    inputCheckErrorsMiddleware,
    validatorParamBlogId,
    inputCheckCorrectIdMiddleware,
    blogsController.createPostForSpecialBlog.bind(blogsController))