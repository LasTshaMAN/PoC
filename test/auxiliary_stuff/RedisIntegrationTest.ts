import {RedisClient} from "redis";
import * as console from "web-request";
import * as rtf from "web-request";
import RestServer from "../../src/RestServer";
import {expect} from "chai";
import StatusDataService from "../../src/StatusDataService";


export function testIntegrationWithRedisUsing(redisClient: RedisClient) {
    describe('Testing integration with embedded Redis', () => {

        const api = 'http://localhost:3000';
        const server = new RestServer(new StatusDataService(redisClient));

        beforeEach('run server', () => {
            server.start();
        });

        afterEach('stop server', () => {
            server.stop();
            redisClient.flushall();
        });

        it('RTF instance should be able to register new status for Console to read', async () => {
            let firstStatus = {
                rtf_instance_name: 'rtf-1',
                current_config_version: '3'
            };
            let secondStatus = {
                rtf_instance_name: 'rtf-2',
                current_config_version: '2',
                trying_to_apply_config: {
                    config_version: '3',
                    error_message: 'Unable to create HTTP adapter. Port 8080 is unavailable.'
                }
            };

            await rtf.put(api + '/v1/status', {json: firstStatus});
            await rtf.put(api + '/v1/status', {json: secondStatus});
            let result = await console.get(api + '/v1/statuses');
            let statusCode = result.statusCode;
            let content = JSON.parse(result.content);

            expect(statusCode).to.equal(200);
            expect(content).to.deep.include(firstStatus);
            expect(content).to.deep.include(secondStatus);
        });

        it('RTF instance should be able to update existing status for Console to read', async () => {
            let oldStatus = {
                rtf_instance_name: 'rtf-1',
                current_config_version: '2',
                trying_to_apply_config: {
                    config_version: '3',
                    error_message: 'Unable to create HTTP adapter. Port 8080 is unavailable.'
                }
            };
            let newStatus = {
                rtf_instance_name: 'rtf-1',
                current_config_version: '3'
            };
            let someUnrelatedStatus = {
                rtf_instance_name: 'rtf-2',
                current_config_version: '2'
            };

            await rtf.put(api + '/v1/status', {json: oldStatus});
            await rtf.put(api + '/v1/status', {json: someUnrelatedStatus});
            await rtf.put(api + '/v1/status', {json: newStatus});
            let result = await console.get(api + '/v1/statuses');
            let statusCode = result.statusCode;
            let content = JSON.parse(result.content);

            expect(statusCode).to.equal(200);
            expect(content).to.not.deep.include(oldStatus);
            expect(content).to.deep.include(newStatus);
            expect(content).to.deep.include(someUnrelatedStatus);

        });
    });
};