import express, { Request, Response } from 'express';

const router = express.Router();

router.route('/')
  .get(async (req: Request, res: Response) => {
    res.status(200).send({ ping: 'pong' });
  });

export default router;