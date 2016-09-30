import RestServer from "./RestServer";
import StatusDataService from "./StatusDataService";
import * as redis from "redis";


let redisClient = redis.createClient(9999);
let statusDataService = new StatusDataService(redisClient);
let server = new RestServer(statusDataService);

server.start();
console.log('Server is listening on default port 3000');