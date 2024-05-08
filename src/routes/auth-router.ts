import {Router} from "express";
import {authController} from "../auth/authController";
import {validationInputAuth} from "../auth/middleware/input-validation-middleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {authJwtMiddleware} from "../middleware/auth-jwt-middleware";
import {validationInputRegistrationUser} from "../auth/middleware/input-registarion-validation-middleware";


export const authRouter = Router({});

authRouter.post('/login', ...validationInputAuth, inputCheckErrorsMiddleware, authController.login);
authRouter.get('/me', authJwtMiddleware, authController.me)

authRouter.post('/registration', ...validationInputRegistrationUser, inputCheckErrorsMiddleware, authController.registration)

authRouter.post('/registration-confirmation', authController.confirmationEmail)