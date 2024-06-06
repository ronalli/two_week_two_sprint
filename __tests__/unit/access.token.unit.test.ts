import {db} from "../../src/db/db";
import {jwtService} from "../../src/utils/jwt-services";
import {UsersRepositories} from "../../src/users/usersRepositories";
import {AuthService} from "../../src/auth/authService";
import {ResultCode} from "../../src/types/resultCode";
import {ObjectId} from "mongodb";

const usersRepositories = new UsersRepositories()
const authService = new AuthService();

describe('auth-integration', () => {

    beforeAll(async () => {
        await db.run();
    })

    beforeEach(async () => {
        await db.dropCollections()
    })

    afterAll(async () => {
        await db.dropDB();
    })

    afterAll(done => done())

    const checkAccessTokenUseCase = authService.checkAccessToken.bind(authService);


    it('should not verify noBearer auth', async () => {
        const result = await checkAccessTokenUseCase('Basic grt43fs466')
        expect(result.status).toBe(ResultCode.Unauthorized)
    })

    it('should not verify in jwtService', async () => {
        jwtService.getUserIdByToken = jest.fn().mockImplementation((token: string) => null)

        const result = await checkAccessTokenUseCase('Bearer grt43fs466')

        expect(result.status).toBe(ResultCode.Unauthorized)
    })

    it('should not verify in usersMongoRepositories', async() => {
        jwtService.getUserIdByToken = jest.fn().mockImplementation((token: string) => {
            return new ObjectId().toHexString()
        })

        usersRepositories.doesExistById = jest.fn().mockImplementation((userId: string) => {
            return null;
        })

        const result = await checkAccessTokenUseCase('Bearer grt43fs466')

        expect(result.status).toBe(ResultCode.Unauthorized)
    })

    it('should correct verify user', async() => {
        jwtService.getUserIdByToken = jest.fn().mockImplementation((token: string) => {
            return new ObjectId().toHexString()
        })
        usersRepositories.doesExistById = jest.fn().mockImplementation((userId: string) => {
            return {
                data: 'fd6sfs8d'
            }
        })

        const result = await checkAccessTokenUseCase('Bearer grt43fs466')

        expect(result.status).toBe(ResultCode.Success)
    })

})
