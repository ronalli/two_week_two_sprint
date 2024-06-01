import {Response, Request, NextFunction} from "express";
import {IRateLimitTypeDB} from "../../types/rate-limit-type";
import {HTTP_STATUSES} from "../../settings";
import {RateLimitModel} from "../../security/domain/rateLimit.entity";


export const rateLimitGuard = async (req: Request, res: Response, next: NextFunction) => {

    const a = await RateLimitModel.find({
        $and: [
            {ip: req.ip},
            {url: req.originalUrl},
            {date: {$gte: new Date().getTime() - 10000}},
        ]
    })

    if (a.length >= 5) {
        // await rateLimitCollection.deleteMany({ip: req.ip, url: req.originalUrl},)
        res.status(HTTP_STATUSES.TooManyRequests).send({})
        return;
    }

    const dataRequest: IRateLimitTypeDB = {
        date: new Date().getTime(),
        url: req.originalUrl,
        ip: req.ip!
    }

    const newRateLimit = new RateLimitModel(dataRequest)

    await newRateLimit.save();

    next();
}