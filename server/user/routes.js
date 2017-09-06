import express from 'express';

import controller from './controller';

const userRouter = express.Router();

userRouter.post('/:id/', controller.updateUser);

export default userRouter;
