import express, { Application, json, urlencoded } from 'express';

import fibRouter from './fib';
import healthRouter from './health';
import { detectBlocks } from './utils/detect-blocks';

const app: Application = express();

const port = process.env['PORT'] ?? 3000;
const env = process.env['NODE_ENV'] ?? 'Not Specified';

app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/fib', fibRouter);
app.use('/health', healthRouter);

try {
  detectBlocks(250);
  app.listen(port, () => {
    console.log(`Server running on ${port} [${env}]`);
  });
} catch (err){
  console.log(`Error running server: ${err}`);
}