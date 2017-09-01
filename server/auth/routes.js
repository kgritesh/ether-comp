import express from 'express';

import controller from './controller';

const authRouter = express.Router();

authRouter.post('/google/start/', controller.initGoogleAuth);
authRouter.post('/google/complete/', controller.completeGoogleAuth);

export default authRouter;
