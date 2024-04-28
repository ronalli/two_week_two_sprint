import express from "express";
import {HTTP_STATUSES, SETTINGS} from "./settings";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {testingRouter} from "./routes/testing-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";

export const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(HTTP_STATUSES.OK_200).send({version: "1.0"})
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.ALL_DELETE, testingRouter)