import {req} from "../test-helpers";
import {HTTP_STATUSES} from "../../src/settings";
import {SETTINGS} from "../../src/settings";
import {db} from "../../src/db/db";
import {testSeeder} from "../utils/test.seeder";
import {serviceUsers} from "../utils/serviceUsers";

describe("Users Tests", () => {

    beforeAll(async () => {
       await db.run();
    })

    afterAll(async () => {
        await db.dropDB();
    })

    afterAll(done => done())

    it("shouldn't create user without authorization", async () => {
        await req.post(SETTINGS.PATH.USERS).send({login: ''}).expect(HTTP_STATUSES.Unauthorized)
    })

    it("shouldn't create user with correct authorization", async () => {
        await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '').send({login: ''}).expect(HTTP_STATUSES.BadRequest)
    })

    it("should create user with correct authorization", async () => {
        let newUser = testSeeder.createUserDto();

        await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '').send(newUser).expect(HTTP_STATUSES.Created)
    })

    it('shouldn\'t get all users without authorization', async () => {
        await req.get(SETTINGS.PATH.USERS).expect(HTTP_STATUSES.Unauthorized);
    })

    it('should get all users with correct authorization headers', async () => {
        await req.get(SETTINGS.PATH.USERS).auth(process.env.USER || '', process.env.PASSWORD || '').expect(HTTP_STATUSES.Success);
    })

    it('should correct delete user', async() => {
        const response = await req.get(SETTINGS.PATH.USERS).auth(process.env.USER || '', process.env.PASSWORD || '').expect(HTTP_STATUSES.Success)

        await req.delete(SETTINGS.PATH.USERS + `/${response.body.items[0].id}`).auth(process.env.USER || '', process.env.PASSWORD || '').expect(HTTP_STATUSES.NotContent)

        const result = await req.get(SETTINGS.PATH.USERS).auth(process.env.USER || '', process.env.PASSWORD || '')

        expect(result.body.totalCount).toBe(0)
    });

    it('shouldn\t delete user with incorrect id', async() => {
        await req.delete(SETTINGS.PATH.USERS + '/507f191e810c19729de860ea').auth(process.env.USER || '', process.env.PASSWORD || '').expect(HTTP_STATUSES.NotFound)
    })


    it('should get users with query params', async () => {

        const users = await serviceUsers.createUsers(5)

        const response = await req.get(SETTINGS.PATH.USERS + `?sortBy=login&sortDirection=asc&pageNumber=1&pageSize=4`).set('Authorization', process.env.AUTH_HEADER || '').expect(HTTP_STATUSES.Success);

        expect(response.body.totalCount).toBe(6)
        expect(response.body.items[0].login).toEqual('testing0')

    })


})
