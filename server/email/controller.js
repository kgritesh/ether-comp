import createError from 'http-errors';

import { AuthProvider } from '../provider/index';
import { emailQueue } from './tasks';

export default {
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
