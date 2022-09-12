import express, { Request, Response } from 'express';
import { fib } from './services/fib-service';
import * as fibWorker from './services/fib-worker';
import { pool } from 'workerpool';
import path from 'path';

const fibPool = pool(path.join(__dirname, 'services/fib-workerpool.js'));
const router = express.Router();

router.route('/:count')
  .get(async (req: Request, res: Response) => {
    let count = req.params.count ? +req.params.count : 1;
    const result = fib(count);

    res.status(200).send({ result });
  });

router.route('/worker/:count')
  .get(async (req: Request, res: Response) => {
    let count = req.params.count ? +req.params.count : 1;
    const result = await fibWorker.run(count);
    
    res.status(200).send(result);
  });

router.route('/worker-pool/:count')
  .get(async (req: Request, res: Response) => {
    let count = req.params.count ? +req.params.count : 1;
    try {
      console.log(fibPool);
      const result = await fibPool.exec('fibo', [count]);

      res.status(200).send(result);
    } catch (err) {
      console.log('$$$ Error: ', err);
      return res.status(500).send({ message: 'Error ocurred' });
    } finally {
      await fibPool.terminate();
    }
  })

export default router;