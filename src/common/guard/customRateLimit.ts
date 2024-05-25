import {Response, Request, NextFunction} from "express";
import {rateLimitCollection} from "../../db/mongo-db";
import {IRateLimitTypeDB} from "../../types/rate-limit-type";
import {HTTP_STATUSES} from "../../settings";


export const rateLimitGuard = async (req: Request, res: Response, next: NextFunction) => {

    const a = await rateLimitCollection.find({
        $and: [
            {ip: req.ip},
            {url: req.originalUrl},
            {date: {$gte: new Date().getTime() - 1000}},
        ]
    }).toArray()

    if (a.length >= 5) {
        await rateLimitCollection.deleteMany({ip: req.ip, url: req.originalUrl},)
        res.status(HTTP_STATUSES.TooManyRequests).send({})
        return;
    }

    const dataRequest: IRateLimitTypeDB = {
        date: new Date().getTime(),
        url: req.originalUrl,
        ip: req.ip!
    }

    await rateLimitCollection.insertOne(dataRequest)

    next();
}