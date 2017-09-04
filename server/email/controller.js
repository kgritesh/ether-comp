import createError from 'http-errors';

import { AuthProvider } from '../provider/index';
import { emailQueue } from './tasks';
import { IncomingEmail } from './models';

export default {

  async validateEmail(req, res) {
    const emailId = req.params.emailId;
    try {
      const message = await IncomingEmail.get(emailId)
        .getJoin({ account: true }).run();

      res.json({
        id: message.id,
        email: message.account.email
      });
    } catch (error) {
      req.logger.error(error, { emailId }, 'Failed while validating email');
      res.status(404).json({});
    }
  },

  handleEmailCallback(req, res) {
    const provider = req.params.provider;
    if (provider === AuthProvider.GOOGLE.value.toLowerCase()) {
      this._handleGmailCallback(req, res);
    } else {
      throw createError(404, 'Not Found');
    }
  },

  _handleGmailCallback(req, res) {
    const payload = JSON.parse(
      new Buffer(req.body.message.data, 'base64').toString()
    );
    emailQueue.add({ payload, provider: 'google' });
    res.send('ok');
  }
};
