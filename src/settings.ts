import {config} from "dotenv";

config();

export const SETTINGS = {
    PORT: process.env.PORT || 3000,
    PATH: {
        BLOGS: '/hometask_07/api/blogs',
        POSTS: '/hometask_07/api/posts',
        USERS: '/hometask_07/api/users',
        AUTH: '/hometask_07/api/auth',
        ALL_DELETE: '/hometask_07/api/testing',
        COMMENTS: '/hometask_07/api/comments',
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost',
    DB_NAME: process.env.DB_NAME || 'it-incubator',
    BLOG_COLLECTION_NAME: 'blogs',
    POSTS_COLLECTION_NAME: 'posts',
    USERS_COLLECTION_NAME: 'users',
    COMMENTS_COLLECTION_NAME: 'comments',
}

// export const HTTP_STATUSES = {
//     OK_200: 200,
//     NOT_FOUND_404: 404,
//     NO_CONTENT_204: 204,
//     CREATED_201: 201,
//     BED_REQUEST_400: 400,
//     UNAUTHORIZED: 401,
//     FORBIDDEN_403: 403
// }

export const HTTP_STATUSES = {
    Success: 200,
    NotFound: 404,
    Forbidden: 403,
    Unauthorized: 401,
    BadRequest: 400,
    NotContent: 204,
    Created: 201,
    InternalServerError: 500,
}