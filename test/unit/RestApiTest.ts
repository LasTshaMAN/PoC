import * as request from "web-request";
import RestServer from "../../src/RestServer";
import {expect} from "chai";
import * as sinon from "sinon";


describe('Testing REST API', () => {

    const api = 'http://localhost:3000';
    const statusDataServiceMock = {
        getStatuses: () => {
        },
        updateStatus: () => {
        }
    };
    const server = new RestServer(<any> statusDataServiceMock);

    beforeEach('run server', () => {
        server.start();
    });

    afterEach('stop server', () => {
        server.stop();
    });

    it('should provide an endpoint for polling configuration statuses', async () => {
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
        statusDataServiceMock.getStatuses = sinon.stub()
            .withArgs(sinon.match.func)
            .callsArgWith(0, statuses);

        let result = await request.get(api + '/v1/statuses');
        let statusCode = result.statusCode;
        let content = JSON.parse(result.content);

        expect(statusCode).to.equal(200);
        expect(content).to.deep.equal(statuses);
    });

    describe('should provide an endpoint for registering new or updating existing rtf status', () => {

        it('should allow for status with error payload', async () => {
            let status = {
                rtf_instance_name: 'rtf-2',
                current_config_version: '2',
                trying_to_apply_config: {
                    config_version: '3',
                    error_message: 'Unable to create HTTP adapter. Port 8080 is unavailable.'
                }
            };
            statusDataServiceMock.updateStatus = sinon.stub()
                .withArgs(status, sinon.match.func)
                .callsArg(1);

            let result = await request.put(api + '/v1/status', {json: status});
            let statusCode = result.statusCode;

            expect(statusCode).to.equal(200);
        });

        it('should allow for status without error payload', async () => {
            let status = {
                rtf_instance_name: 'rtf-2',
                current_config_version: '2'
            };
            statusDataServiceMock.updateStatus = sinon.stub()
                .withArgs(status, sinon.match.func)
                .callsArg(1);

            let result = await request.put(api + '/v1/status', {json: status});
            let statusCode = result.statusCode;

            expect(statusCode).to.equal(200);
        });
    });
});