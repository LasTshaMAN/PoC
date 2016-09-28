import * as console from 'request';
import * as rtf from 'request';
import RestServer from '../src/RestServer';
import {expect} from 'chai';
import * as redis from "redis";
import StatusDataService from "../src/StatusDataService";


describe('Testing integration with Redis', () => {

    const url = 'http://localhost:3000';
    const redisClient = redis.createClient(16379);
    const server = new RestServer(new StatusDataService(redisClient));

    beforeEach('run server', () => {
        server.start();
    });

    afterEach('stop server', () => {
        server.stop();
        redisClient.flushdb();
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

        rtf.put(url + '/update_status', {json: firstStatus});
        rtf.put(url + '/update_status', {json: secondStatus});

        console.get(url + '/statuses', (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)).to.deep.include(firstStatus);
            expect(JSON.parse(body)).to.deep.include(secondStatus);

            done();
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

        rtf.put(url + '/update_status', {json: oldStatus});
        rtf.put(url + '/update_status', {json: newStatus});

        console.get(url + '/statuses', (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)).to.not.deep.include(oldStatus);
            expect(JSON.parse(body)).to.deep.include(newStatus);

            done();
        });
    });
});