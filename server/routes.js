import express from 'express';

import authRouter from './auth/routes';
import emailRouter from './email/routes';

const apiRouter = express.Router();

apiRouter
  .use('/auth', authRouter)
  .use('/email', emailRouter)
  .get('/favicon.ico', (req, res) => res.status(204).send());

export default apiRouter;
