import RestServer from "../../src/RestServer";
import request = require("request");
import {expect} from "chai";
import {ECONNREFUSED} from "constants";


describe('Testing RestServer', () => {

    const api = 'http://localhost:3000';
    const statusDataServiceMock = {};
    const server = new RestServer(<any> statusDataServiceMock);

    it('should be able to run on 3000 port by default', (done) => {
        server.start();

        request.get(api, (error, response) => {
            expect(response.statusCode).to.equal(404);

            server.stop();
            done();
        });
    });

    it('should be able to stop listening for connections', (done) => {
        server.start();
        server.stop();

        request.get(api, (error) => {
            expect(error.code).to.equal('ECONNREFUSED');

            done();
        });
    });
});