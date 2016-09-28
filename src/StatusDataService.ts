import {RedisClient} from "redis";


export default class StatusDataService {

    redisClient: RedisClient;

    constructor(redisClient: RedisClient) {
        this.redisClient = redisClient;
    }

    getStatuses(callback: (result: any) => void): void {
        this.redisClient.hgetall('statuses', callback);
    }

    updateStatus(status: any, callback: () => void): void {
        let rtfInstanceName = status.rtf_instance_name;
        this.redisClient.hset('statuses', rtfInstanceName, status, callback);
    }
}