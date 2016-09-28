import {RedisClient} from "redis";


export default class StatusDataService {

    redisClient: RedisClient;

    constructor(redisClient: RedisClient) {
        this.redisClient = redisClient;
    }

    getStatuses(callback: (result) => void): void {
        this.redisClient.hvals('statuses', (err, result) => {
            callback(result.map((value) => {
                return JSON.parse(value);
            }));
        });
    }

    updateStatus(status: any, callback: () => void): void {
        let rtfInstanceName = status.rtf_instance_name;
        this.redisClient.hset('statuses', rtfInstanceName, JSON.stringify(status), callback);
    }
}