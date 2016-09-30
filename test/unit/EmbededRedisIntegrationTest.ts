import {testIntegrationWithRedisUsing} from "../subsidiary_entities/RedisIntegrationTest";
let redis = require('redis-mock');


let mockRedisClient = redis.createClient();
testIntegrationWithRedisUsing(mockRedisClient);