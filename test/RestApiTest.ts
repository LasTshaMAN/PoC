import * as supertest from 'supertest';

import { RestApi } from '../src/RestApi';

describe('Testing REST API', () => {

    const client = supertest(RestApi);

    before(() => {
    });

    it('should have an endpoint for demonstration purposes', (done) => {
        client
            .get('/hello')
            .expect(200, done);
    });
});