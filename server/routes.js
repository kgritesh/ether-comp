import express from 'express';

import authRouter from './auth/routes';
import { emailRouter, emailAccountRouter } from './email/routes';
import userRouter from './user/routes';


const apiRouter = express.Router();

apiRouter
  .use('/auth', authRouter)
  .use('/account', emailAccountRouter)
  .use('/email', emailRouter)
  .use('/user', userRouter)
  .get('/favicon.ico', (req, res) => res.status(204).send());

export default apiRouter;
