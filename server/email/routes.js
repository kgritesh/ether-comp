import express from 'express';

import controller from './controller';

const emailRouter = express.Router();

emailRouter.post('/:emailId/validate/', ::controller.validateEmail);
emailRouter.post('/:provider/callback/', ::controller.handleEmailCallback);

export default emailRouter;
