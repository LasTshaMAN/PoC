import {testIntegrationWithRedisUsing} from "../subsidiary_entities/RedisIntegrationTest";
import * as redis from "redis";


let realRedisClient = redis.createClient(9999);
testIntegrationWithRedisUsing(realRedisClient);