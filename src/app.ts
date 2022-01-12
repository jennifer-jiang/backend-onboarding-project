import Express, { Request, Response } from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import cors from 'cors'
import { router } from './controller';
const app = Express();
const port = process.env.PORT || 4000;

app.use(cors())

app.use(bodyParser.json()); // regular json payloads
app.use(bodyParser.urlencoded({ extended: true })); // html form payloads


const main = async () => {
  app.use(router);
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}

main()