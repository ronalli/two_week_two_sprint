import {param} from "express-validator";
import {postsQueryRepositories} from "../posts/postsQueryRepositories";

export const validatorParamPostId = param("id").custom(async id => {
    const isValid = await postsQueryRepositories.findPostById(id)
    if(!isValid.data) {
        throw new Error('Field is incorrect')
    }
    return true;
})