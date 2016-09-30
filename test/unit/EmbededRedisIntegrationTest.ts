import {testIntegrationWithRedisUsing} from "../auxiliary_stuff/RedisIntegrationTest";
let redis = require("redis-mock");


let mockRedisClient = redis.createClient();
testIntegrationWithRedisUsing(mockRedisClient);