import {testSeeder} from "./test.seeder";
import {req} from "../test-helpers";
import {HTTP_STATUSES, SETTINGS} from "../../src/settings";
import {serviceUsers} from "./serviceUsers";

export const serviceLogin = {
    user: async () => {
        const newUser = await serviceUsers.createUser();
        //response jwt-token
        const response = await req.post(SETTINGS.PATH.AUTH + '/login').send({
            loginOrEmail: 'testing',
            password: '12345678',
        }).expect(HTTP_STATUSES.Success)

        // console.log(response.body)

        return response.body
    }
}