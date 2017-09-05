import express from 'express';

import controller from './controller';

const userRouter = express.Router();

userRouter.post('/:id/', controller.updateUser);
userRouter.post('/:id/ether-account/', controller.setEtherAccount);

export default userRouter;
