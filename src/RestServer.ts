import * as express from "express";
import { Request } from '~express/lib/request';
import { Response } from '~express/lib/response';

export default class RestServer {

    readonly app: express.Application;

    constructor() {
        this.app = express();

        this.app.use('/hello', (req: Request, res: Response, next: express.NextFunction) => {
            res.status(200);
            res.contentType('json');
            res.json({ x: 3 });
        });
    }

    start(): void {
        this.app.listen(3000);
    }
}