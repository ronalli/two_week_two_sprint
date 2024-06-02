import {randomUUID} from "node:crypto";
import {jwtService} from "../../utils/jwt-services";

export const createRecoveryCode = (email: string, time: string = '5m') => jwtService.createdRecoveryCode(email, time)
