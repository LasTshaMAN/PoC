import StatusDataService from "../src/StatusDataService";
import {expect} from "chai";
import * as sinon from 'sinon';


describe('Testing StatusDataService', () => {

    const redisMock = {
        hgetall: () => {},
        hset: () => {}
    };
    const statusDataService = new StatusDataService(<any> redisMock);

    it('should return RTF configuration statuses as an array of ConfigurationStatus objects', (done) => {
        let actualStatuses = '';
        let expectedStatuses = [
            {
                rtf_instance_name: 'rtf-1',
                current_config_version: '3'
            },
            {
                rtf_instance_name: 'rtf-2',
                current_config_version: '2',
                trying_to_apply: {
                    config_version: '3',
                    error_message: 'Unable to create HTTP adapter. Port 8080 is unavailable.'
                }
            },
        ];
        redisMock.hgetall = sinon.stub()
            .withArgs('statuses', sinon.match.func)
            .callsArgWith(1, expectedStatuses);


        statusDataService.getStatuses((result) => {
            actualStatuses = result;
        });


        expect(actualStatuses).to.deep.equal(expectedStatuses);
        
        done();
    });

    it('should register new status or update the existing one', (done) => {
        let status = {
            rtf_instance_name: 'rtf-2',
            current_config_version: '2',
            trying_to_apply: {
                config_version: '3',
                error_message: 'Unable to create HTTP adapter. Port 8080 is unavailable.'
            }
        };
        redisMock.hset = sinon.stub()
            .withArgs('statuses', sinon.match.string, status, sinon.match.func)
            .callsArg(3);
        let callback = sinon.spy();

        statusDataService.updateStatus(status, callback);

        sinon.assert.calledOnce(<any> redisMock.hset);
        sinon.assert.calledOnce(callback);

        done();
    });
});