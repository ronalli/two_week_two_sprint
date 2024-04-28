import {app} from "./app";
import {SETTINGS} from "./settings";
import {connectToDB} from "./db/mongo-db";


const start = async () => {
    if(!await connectToDB()) {
        console.log('stop')
        return;
    }
    app.listen(SETTINGS.PORT, () => {
        console.log(`....started server on the ${SETTINGS.PORT}`)
    })
}

start();



