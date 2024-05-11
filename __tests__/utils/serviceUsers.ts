import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {testSeeder} from "./test.seeder";
import {IUserViewModel} from "../../src/users/types/user-types";


export const serviceUsers = {
    createUser: async (): Promise<IUserViewModel> => {
        const response = await req.post(SETTINGS.PATH.USERS)
            .set('Authorization', process.env.AUTH_HEADER || '')
            .send(testSeeder.createUserDto()).expect(HTTP_STATUSES.Created)
        return response.body;
    },

    createUsers: async (count: number):Promise<IUserViewModel[]> => {
        const users: IUserViewModel[] = [];

        for(let i = 0; i <= count; i++) {
            const response = await req.post(SETTINGS.PATH.USERS).set('Authorization', process.env.AUTH_HEADER || '').send({
                login: `testing${i}`,
                email: `test${i}@gmail.com`,
                password: '12345678',
            }).expect(HTTP_STATUSES.Created);

            users.push(response.body)
        }
        return users;
    }
}
