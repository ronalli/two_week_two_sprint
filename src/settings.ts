import {config} from "dotenv";

config();

export const SETTINGS = {
    PORT: process.env.PORT || 3000,
    PATH: {
        BLOGS: '/hometask_09/api/blogs',
        POSTS: '/hometask_09/api/posts',
        USERS: '/hometask_09/api/users',
        AUTH: '/hometask_09/api/auth',
        ALL_DELETE: '/hometask_09/api/testing',
        COMMENTS: '/hometask_09/api/comments',
        SECURITY: '/hometask_09/api/security/devices'
    },
    MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost',
    DB_NAME: process.env.DB_NAME || 'it-incubator',
    BLOG_COLLECTION_NAME: 'blogs',
    POSTS_COLLECTION_NAME: 'posts',
    USERS_COLLECTION_NAME: 'users',
    COMMENTS_COLLECTION_NAME: 'comments',
    REFRESH_TOKENS_COLLECTION_NAME: 'oldTokens',
    SESSIONS_COLLECTION_NAME: 'sessions',
    RATE_LIMIT_COLLECTION_NAME: 'rateLimit',
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
    TooManyRequests: 429
}