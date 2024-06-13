import {Router} from "express";
import {validationQueryUsers} from "../users/middleware/query-validation-middleware";
import {validationInputBodyUser} from "../users/middleware/input-validation-middleware";
import {authMiddleware} from "../middleware/auth-middleware";
import {inputCheckErrorsMiddleware} from "../middleware/inputCheckErrorsMiddleware";
import {UserController} from "../users/usersController";
import {container} from "../composition-root";

const usersController = container.resolve(UserController)

export const usersRouter = Router({});

usersRouter.get('/', authMiddleware, ...validationQueryUsers, inputCheckErrorsMiddleware, usersController.getAllUsers.bind(usersController))
usersRouter.post('/', authMiddleware, ...validationInputBodyUser, inputCheckErrorsMiddleware, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', authMiddleware, usersController.deleteUser.bind(usersController))