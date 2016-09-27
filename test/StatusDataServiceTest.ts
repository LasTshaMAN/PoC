import StatusDataService from "../src/StatusDataService";
import {expect} from "chai";
import * as sinon from 'sinon';


describe('Testing StatusDataService', () => {

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
        let redisMock = {
            hgetall: sinon.stub().withArgs('statuses', sinon.match.func).callsArgWith(1, expectedStatuses)
        };
        let statusDataService = new StatusDataService(<any> redisMock);


        statusDataService.getStatuses((result) => {
            actualStatuses = result;
        });


        expect(actualStatuses).to.deep.equal(expectedStatuses);
        done();
    });
});