import {Router} from 'express';
import {securityController} from "../security/securityController";
import {guardRefreshToken} from "../middleware/guardRefreshToken";

export const securityRouter = Router({});


securityRouter.get('/', guardRefreshToken, securityController.getSessions)
securityRouter.delete('/', guardRefreshToken, securityController.deleteAllDevices)
securityRouter.delete('/:deviceId', guardRefreshToken, securityController.deleteDeviceById)