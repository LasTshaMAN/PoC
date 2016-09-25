import * as request from "request";
import { expect } from 'chai';
import RestServer from "../src/RestServer";


describe('Testing REST API', () => {

    const url = 'http://localhost:3000';
    let server: RestServer;

    before(() => {
        server = new RestServer();
        server.start();
    });

    it('should have an endpoint for demonstration purposes', (done) => {
        request.get(url + "/hello", (error, response, body) => {
            expect(response.statusCode).equal(200);
            done();
        });
    });
});