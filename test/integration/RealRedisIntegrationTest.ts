import {testIntegrationWithRedisUsing} from "../auxiliary_stuff/RedisIntegrationTest";
import * as redis from "redis";


let realRedisClient = redis.createClient(9999);
testIntegrationWithRedisUsing(realRedisClient);