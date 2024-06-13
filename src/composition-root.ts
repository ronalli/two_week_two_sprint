import {Container} from "inversify";

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
import {UserController} from "./users/usersController";

export const container = new Container()

container.bind(UserController).to(UserController);
container.bind<UsersServices>(UsersServices).to(UsersServices);
container.bind<UsersRepositories>(UsersRepositories).to(UsersRepositories);
container.bind<UsersQueryRepositories>(UsersQueryRepositories).to(UsersQueryRepositories);

container.bind(PostsController).to(PostsController);
container.bind<PostsServices>(PostsServices).to(PostsServices);
container.bind<PostsRepositories>(PostsRepositories).to(PostsRepositories);
container.bind<PostsQueryRepositories>(PostsQueryRepositories).to(PostsQueryRepositories);

container.bind(CommentsController).to(CommentsController);
container.bind<CommentsServices>(CommentsServices).to(CommentsServices);
container.bind<CommentsRepositories>(CommentsRepositories).to(CommentsRepositories);
container.bind<CommentsQueryRepositories>(CommentsQueryRepositories).to(CommentsQueryRepositories);

container.bind(BlogsController).to(BlogsController);
container.bind<BlogsServices>(BlogsServices).to(BlogsServices);
container.bind<BlogsRepositories>(BlogsRepositories).to(BlogsRepositories);
container.bind<BlogsQueryRepositories>(BlogsQueryRepositories).to(BlogsQueryRepositories);

container.bind(SecurityController).to(SecurityController);
container.bind<SecurityServices>(SecurityServices).to(SecurityServices);
container.bind<SecurityRepositories>(SecurityRepositories).to(SecurityRepositories);
container.bind<SecurityQueryRepositories>(SecurityQueryRepositories).to(SecurityQueryRepositories);

container.bind(AuthController).to(AuthController);
container.bind<AuthService>(AuthService).to(AuthService);
container.bind<AuthRepositories>(AuthRepositories).to(AuthRepositories);
container.bind<AuthQueryRepositories>(AuthQueryRepositories).to(AuthQueryRepositories);

