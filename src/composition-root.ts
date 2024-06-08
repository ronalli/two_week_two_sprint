import {SecurityRepositories} from "./security/securityRepositories";
import {SecurityQueryRepositories} from "./security/securityQueryRepositories";
import {SecurityServices} from "./security/securityServices";
import {SecurityController} from "./security/securityController";
import {AuthRepositories} from "./auth/authRepositories";
import {AuthQueryRepositories} from "./auth/authQueryRepositories";
import {AuthService} from "./auth/authService";
import {AuthController} from "./auth/authController";
import {BlogsRepositories} from "./blogs/blogsRepositories";
import {BlogsQueryRepositories} from "./blogs/blogsQueryRepositories";
import {BlogsServices} from "./blogs/blogsServices";
import {BlogsController} from "./blogs/blogsController";
import {PostsRepositories} from "./posts/postsRepositories";
import {PostsQueryRepositories} from "./posts/postsQueryRepositories";
import {PostsServices} from "./posts/postsServices";
import {PostsController} from "./posts/postsController";
import {CommentsRepositories} from "./comments/commentsRepositories";
import {CommentsQueryRepositories} from "./comments/commentsQueryRepositories";
import {CommentsServices} from "./comments/commentsServices";
import {CommentsController} from "./comments/commentsController";
import {UsersRepositories} from "./users/usersRepositories";
import {UsersQueryRepositories} from "./users/usersQueryRepositories";
import {UsersServices} from "./users/usersServices";

//users
const usersRepositories = new UsersRepositories();
const usersQueryRepositories = new UsersQueryRepositories();
const userServices = new UsersServices();
const usersController = new UsersServices();

//security
const securityRepositories = new SecurityRepositories();
const securityQueryRepositories = new SecurityQueryRepositories();
const securityServices = new SecurityServices(securityRepositories, securityQueryRepositories);
export const securityController = new SecurityController(securityServices)

//auth
const authRepositories = new AuthRepositories(usersRepositories);
const authQueryRepositories = new AuthQueryRepositories();
const authService = new AuthService(authRepositories, authQueryRepositories, usersRepositories, usersQueryRepositories, securityServices);
export const authController = new AuthController(authService, userServices);

//blog

const blogsRepositories = new BlogsRepositories();
const blogsQueryRepositories = new BlogsQueryRepositories();
const blogsServices = new BlogsServices();
export const blogsController = new BlogsController()

//posts

const postsRepositories = new PostsRepositories();
const postsQueryRepositories = new PostsQueryRepositories()
const postsServices = new PostsServices();
const postsController = new PostsController();

//comments
const commentsRepositories = new CommentsRepositories();
const commentsQueryRepositories = new CommentsQueryRepositories();
const commentsServices = new CommentsServices();
const commentsController = new CommentsController();
