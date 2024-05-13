import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";
import {authService} from "../../src/auth/authService";
import {nodemailerService} from "../../src/common/adapter/nodemailer.service";
import {testSeeder} from "../utils/test.seeder";
import {ResultCode} from "../../src/types/resultCode";
import {SETTINGS} from "../../src/settings";
import {req} from "../test-helpers";

describe('auth-integration', () => {

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await db.run(mongoServer.getUri());
        // await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
    })

    beforeEach(async () => {
        await db.drop();
        // await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
    })

    afterEach(async () => {
        // await db.drop();
        // await req.get(SETTINGS.PATH.ALL_DELETE + '/all-data')
    })

    afterAll(async () => {
        await db.drop();
        // await req.delete(SETTINGS.PATH.ALL_DELETE + '/all-data')
        await db.stop();
    })

    afterAll(done => done())

    describe('User registration', () => {

        const registerUser = authService.registration;

        nodemailerService.sendEmail = jest.fn().mockImplementation((email: string, code: string, template: (code: string) => string) => {
            return true;
        })

        it('should register user with correct data', async () => {

            const userDto = testSeeder.createUserDto();
            const result = await registerUser(userDto);

            // console.log(result)
            expect(result.status).toBe(ResultCode.NotContent);

            expect(nodemailerService.sendEmail).toHaveBeenCalled();
            expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1);


        })

        it('should not register user twice', async () => {
            const user = testSeeder.createUserDto();
            await testSeeder.registerUser(user)


            const result = await registerUser(user);
            expect(result.status).toBe(ResultCode.BadRequest);
        })

    })

})