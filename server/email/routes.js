import express from 'express';

import controller from './controller';

const emailRouter = express.Router();

const emailAccountRouter = express.Router();

emailAccountRouter.post('/:id/ether-account', ::controller.setEtherAccount);
emailRouter.post('/:emailId/validate/', ::controller.validateEmail);
emailRouter.post('/:provider/callback/', ::controller.handleEmailCallback);

export {
  emailRouter,
  emailAccountRouter
};
