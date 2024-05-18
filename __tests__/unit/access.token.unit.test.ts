import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {jwtService} from "../../src/utils/jwt-services";
import {usersMongoRepositories} from "../../src/users/usersMongoRepositories";
import {authService} from "../../src/auth/authService";
import {ResultCode} from "../../src/types/resultCode";

describe('auth-integration', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
    })

    beforeEach(async () => {
        await db.drop();
    })

    afterEach(async () => {

    })

    afterAll(async () => {
        await db.drop();
        await db.stop();
    })

    afterAll(done => done())

    const checkAccessTokenUseCase = authService.checkAccessToken;


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
            return 'fsr4gd354'
        })

        usersMongoRepositories.doesExistById = jest.fn().mockImplementation((userId: string) => {
            return null;
        })

        const result = await checkAccessTokenUseCase('Bearer grt43fs466')

        expect(result.status).toBe(ResultCode.Unauthorized)

    })

    it('should correct verify user', async() => {
        jwtService.getUserIdByToken = jest.fn().mockImplementation((token: string) => {
            return 'df45sdg543'
        })
        usersMongoRepositories.doesExistById = jest.fn().mockImplementation((userId: string) => {
            return {
                data: 'fd6sfs8d'
            }
        })

        const result = await checkAccessTokenUseCase('Bearer grt43fs466')


        expect(result.status).toBe(ResultCode.Success)

    })


})
