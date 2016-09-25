import * as express from "express";


export default class RestServer {

    private readonly app: express.Application;

    constructor() {
        this.app = express();

        this.app.use('/hello', (req, res) => {
            res.status(200);
            res.contentType('json');
            res.json({ x: 3 });
        });
    }

    start(): void {
        this.app.listen(3000);
    }
}