import {param} from "express-validator";
import {blogsQueryRepositories} from "../blogs/blogsQueryRepositories";

export const validatorParamBlogId = param("blogId").custom(async id => {
    const isValid = await blogsQueryRepositories.findBlogById(id)
    if(!isValid.data) {
        throw new Error('Field is incorrect')
    }
    return true;
})