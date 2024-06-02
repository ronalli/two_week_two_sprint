import jwt from 'jsonwebtoken';
import {jwtService} from "../../src/utils/jwt-services";


jest.mock('jsonwebtoken');

describe('test jwt service', () => {

    const secret = 'secret';
    const userId = '12345678'
    const deviceId = '98765'

    const email = 'test@test.com'
    const token = 'mockedToken'

    const recoveryToken = 'mockedRecoveryToken'

    beforeAll(() => {
        process.env.SECRET_PASSWORD = secret;
    })

    describe('created JWT', () => {

        it('should create a JWT token', async () => {

            (jwt.sign as jest.Mock).mockReturnValue(token);

            const result = await jwtService.createdJWT({userId, deviceId}, '1h')

            expect(jwt.sign).toHaveBeenCalledWith({userId, deviceId}, secret, {expiresIn: '1h'});

            expect(result).toBe(token)

        })


    })

    describe('get userId by token', () => {

        it('should return userId from token', async () => {

            (jwt.verify as jest.Mock).mockReturnValue({userId});

            const result = await jwtService.getUserIdByToken(token);

            expect(jwt.verify).toHaveBeenCalledWith(token, secret);

            expect(result).toBe(userId)

        })

        it('should return null if token is invalid', async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            })

            const result = await jwtService.getUserIdByToken(token);

            expect(jwt.verify).toHaveBeenCalledWith(token, secret);

            expect(result).toBeNull()

        })
    })

    describe('decode token', () => {
        it('should decode the token', async () => {

            const decoded = {userId, deviceId};

            (jwt.decode as jest.Mock).mockReturnValue(decoded);

            const result = await jwtService.decodeToken(token);

            expect(result).toBe(decoded)

        })
    })

    describe('created recovery code', () => {

        it('should create a recovery code', async () => {

            (jwt.sign as jest.Mock).mockReturnValue(recoveryToken);

            const result = await jwtService.createdRecoveryCode(email, '1h')

            expect(jwt.sign).toHaveBeenCalledWith({email}, secret, {expiresIn: '1h'});

            expect(result).toBe(recoveryToken)

        })

    })

    describe('get email by token', () => {

        it('should return email from token', async () => {

            (jwt.verify as jest.Mock).mockReturnValue({email})
            const result = await jwtService.getEmailByToken(recoveryToken);

            expect(jwt.verify).toHaveBeenCalledWith(recoveryToken, secret)

            expect(result).toBe(email)

        })

        it('should return null if token is invalid', async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {throw new Error('Invalid token')})

            const result = await jwtService.getEmailByToken(token);

            expect(jwt.verify).toHaveBeenCalledWith(recoveryToken, secret);

            expect(result).toBeNull()


        })

    })


})