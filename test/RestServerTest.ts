import * as request from 'request';
import RestServer from '../src/RestServer';
import {expect} from 'chai';
import StatusDataService from "../src/StatusDataService";

import * as TypeMoq from "typemoq";


describe('Testing REST API', () => {

    const url = 'http://localhost:3000';
    const mock = TypeMoq.Mock.ofType(StatusDataService);
    const server = new RestServer(mock.object);

    beforeEach('run server', () => {
        server.start();
    });

    afterEach('stop server', () => {
        server.stop();
    });

    it('should provide an endpoint for demonstration purposes', (done) => {
        request.get(url + '/hello', (error, response) => {
            expect(response.statusCode).to.equal(200);

            done();
        });
    });

    it('should provide an endpoint for polling configuration statuses', (done) => {
        let statuses = [
            {
                current_config_version: '1',
                trying_to_apply: {
                    config_version: '2'
                }
            }
        ];
        mock.setup(statusDataService => statusDataService.getStatuses()).returns(() => statuses);

        request.get(url + '/status', (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)).to.deep.equal(statuses);

            done();
        });
    });
});