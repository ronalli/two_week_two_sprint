import {Router} from "express";
import {authController} from "../auth/authController";
import {validationInputAuth} from "../auth/middleware/input-validation-middleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {authJwtMiddleware} from "../middleware/auth-jwt-middleware";


export const authRouter = Router({});

authRouter.post('/login', ...validationInputAuth, inputCheckErrorsMiddleware, authController.login);
authRouter.get('/me', authJwtMiddleware, authController.me)