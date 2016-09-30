import {RedisClient} from "redis";
import * as console from "request";
import * as rtf from "request";
import RestServer from "../../src/RestServer";
import {expect} from "chai";
import StatusDataService from "../../src/StatusDataService";


export let testIntegrationWithRedisUsing = (redisClient: RedisClient) => {
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

        it('RTF instance should be able to register new status for Console to read', (done) => {
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
            rtf.put(api + '/v1/status', {json: firstStatus}, () => {
                rtf.put(api + '/v1/status', {json: secondStatus}, () => {
                    console.get(api + '/v1/statuses', (error, response, body) => {
                        expect(response.statusCode).to.equal(200);
                        expect(JSON.parse(body)).to.deep.include(firstStatus);
                        expect(JSON.parse(body)).to.deep.include(secondStatus);

                        done();
                    });
                });
            });
        });

        it('RTF instance should be able to update existing status for Console to read', (done) => {
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
            rtf.put(api + '/v1/status', {json: oldStatus}, () => {
                rtf.put(api + '/v1/status', {json: someUnrelatedStatus}, () => {
                    rtf.put(api + '/v1/status', {json: newStatus}, () => {
                        console.get(api + '/v1/statuses', (error, response, body) => {
                            expect(response.statusCode).to.equal(200);
                            expect(JSON.parse(body)).to.not.deep.include(oldStatus);
                            expect(JSON.parse(body)).to.deep.include(newStatus);
                            expect(JSON.parse(body)).to.deep.include(someUnrelatedStatus);

                            done();
                        });
                    });
                });
            });
        });
    });
};