import RestServer from "./RestServer";
import StatusDataService from "./StatusDataService";
import * as redis from 'redis';

let redisClient = redis.createClient(16379);
let statusDataService = new StatusDataService(redisClient);
let server = new RestServer(statusDataService);

server.start();