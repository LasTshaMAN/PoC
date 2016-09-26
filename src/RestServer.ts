import * as express from 'express';
import StatusDataService from "./StatusDataService";
import {Server} from "http";


export default class RestServer {

    private app: express.Application;
    private server: Server;
    private statusDataService: StatusDataService;

    constructor(statusDataService: StatusDataService) {
        this.statusDataService = statusDataService;
        this.configureRestApi();
    }

    start(): void {
        this.server = this.app.listen(3000);
    }

    stop(): void {
        this.server.close();
    }

    private configureRestApi() {
        this.app = express();

        this.app.use('/hello', (req, res) => {
            res.status(200);
            res.end();
        });

        this.app.use('/status', (req, res) => {
            res.status(200);
            res.contentType('json');
            res.json(this.statusDataService.getStatuses());
        });
    }
}