import * as express from "express";
import StatusDataService from "./StatusDataService";
import {Server} from "http";
import * as bodyParser from "body-parser";


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

        this.app.use(bodyParser.json());

        this.app.get('/v1/statuses', (req, res) => {
            this.statusDataService.getStatuses((result) => {
                res.status(200);
                res.contentType('json');
                res.json(result);
            });
        });

        this.app.put('/v1/status', (req: bodyParser.ParsedAsJson, res) => {
            let newStatus = req.body;
            this.statusDataService.updateStatus(newStatus, () => {
                res.status(200);
                res.end();
            });
        });
    }
}