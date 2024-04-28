import {req} from "./test-helpers";
import {HTTP_STATUSES} from "../src/settings";
import {SETTINGS} from "../src/settings";
import {db} from "../src/db/db";
import {MongoMemoryServer} from 'mongodb-memory-server'
import {IUserInputModel} from "../src/users/types/user-types";

describe("Users Tests", () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
    })

    afterAll(async () => {
        await db.stop();
    })

    afterAll(async () => {
        await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
    })

    afterAll(done => done())

    it("shouldn't create user without authorization", async () => {
        await req.post(SETTINGS.PATH.USERS).send({login: ''}).expect(HTTP_STATUSES.UNAUTHORIZED)
    })

    it("shouldn't create user with correct authorization", async () => {
        await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '').send({login: ''}).expect(HTTP_STATUSES.BED_REQUEST_400)
    })

    it("should create user with correct authorization", async () => {
        let newUser: IUserInputModel = {
            login: 'bob123',
            password: '123456789',
            email: 'bob123@gmail.com',
        }

        await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '').send(newUser).expect(HTTP_STATUSES.CREATED_201)
    })

    it('shouldn\'t get all users without authorization', async () => {
        await req.get(SETTINGS.PATH.USERS).expect(HTTP_STATUSES.UNAUTHORIZED);
    })

    it('should get all users with correct authorization headers', async () => {
        await req.get(SETTINGS.PATH.USERS).auth(process.env.USER || '', process.env.PASSWORD || '').expect(HTTP_STATUSES.OK_200);
    })

    it('should correct delete user', async() => {
        const user = await req.get(SETTINGS.PATH.USERS).auth(process.env.USER || '', process.env.PASSWORD || '').expect(HTTP_STATUSES.OK_200)

        await req.delete(SETTINGS.PATH.USERS + `/${user.body.items[0].id}`).auth(process.env.USER || '', process.env.PASSWORD || '').expect(HTTP_STATUSES.NO_CONTENT_204)

        const result = await req.get(SETTINGS.PATH.USERS).auth(process.env.USER || '', process.env.PASSWORD || '')

        expect(result.body.totalCount).toBe(0)
    });

    it('shouldn\t delete user with incorrect id', async() => {
        await req.delete(SETTINGS.PATH.USERS + '/507f191e810c19729de860ea').auth(process.env.USER || '', process.env.PASSWORD || '').expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should get users with query params', async () => {
        let newUser: IUserInputModel = {
            login: 'bob123',
            password: '123456789',
            email: 'wob123@gmail.com',
        }

        let newUser1: IUserInputModel = {
            login: 'aob123',
            password: '123456789',
            email: 'ob123@gmail.com',
        }

        let newUser2: IUserInputModel = {
            login: 'yra',
            password: '123456789',
            email: 'yra@gmail.com',
        }

        let newUser3: IUserInputModel = {
            login: 'h2leb',
            password: '123456789',
            email: 'qwerty@gmail.com',
        }

        await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '').send(newUser).expect(HTTP_STATUSES.CREATED_201)
        await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '').send(newUser1).expect(HTTP_STATUSES.CREATED_201)
        await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '').send(newUser2).expect(HTTP_STATUSES.CREATED_201)
        await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '').send(newUser3).expect(HTTP_STATUSES.CREATED_201)

        const result = await req.get(SETTINGS.PATH.USERS + `?sortBy=login&sortDirection=asc&pageNumber=1&pageSize=4&searchLoginTerm=ob12&searchEmailTerm=qwerty`).set('Authorization', process.env.AUTH_HEADER || '').expect(HTTP_STATUSES.OK_200);

        expect(result.body.items.length).toBe(3)
        expect(result.body.items[0].login).toBe('aob123')
    })

})
