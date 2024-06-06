import * as mongoose from 'mongoose'

import {SETTINGS} from "../settings";

export const connectToDB = async () => {
    try {
        await mongoose.connect(SETTINGS.MONGO_URL, {dbName: SETTINGS.DB_NAME})
        console.log('connected to DB');
        return true;
    } catch (e) {
        console.log(e)
        await mongoose.connection.close();
        return false
    }
}