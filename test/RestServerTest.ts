import * as request from 'request';
import RestServer from '../src/RestServer';
import {expect} from 'chai';
import * as sinon from 'sinon';


describe('Testing REST API', () => {

    const url = 'http://localhost:3000';
    const statusDataServiceMock = {
        getStatuses: () => {}
    };
    const server = new RestServer(<any> statusDataServiceMock);

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
                rtf_instance_name: 'rtf-1',
                current_config_version: '3'
            },
            {
                rtf_instance_name: 'rtf-2',
                current_config_version: '2',
                trying_to_apply_config: {
                    config_version: '3',
                    error_message: 'Unable to create HTTP adapter. Port 8080 is unavailable.'
                }
            },
        ];
        statusDataServiceMock.getStatuses = sinon.stub().withArgs(sinon.match.func).callsArgWith(0, statuses);

        request.get(url + '/status', (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            expect(JSON.parse(body)).to.deep.equal(statuses);

            done();
        });
    });
});