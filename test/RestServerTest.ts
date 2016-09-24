import * as request from "request";
import { expect } from 'chai';
import { IncomingMessage, createServer } from "http";

import RestServer from '../src/RestServer';

describe('Testing REST API', () => {

    const url = 'http://localhost:3000';
    let server: RestServer;

    before(() => {
        server = new RestServer();
        server.start();
    });

    it('should have an endpoint for demonstration purposes', (done) => {
        request.get(url + "/hello", (error: any, response: IncomingMessage, body: any) => {
            expect(response.statusCode).equal(200);
            done();
        });
    });
});