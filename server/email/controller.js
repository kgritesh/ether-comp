import createError from 'http-errors';

import { AuthProvider } from '../provider/index';
import { emailQueue, emailAccountQueue } from './tasks';
import { IncomingEmail, EmailStatus, EmailAccount } from './models';
import { badRequest, notFound, permissionDenied } from '../common/errors';


export default {

  async setEtherAccount(req, res, next) {
    try {
      const { email, etherAccount } = req.body;
      const account = await EmailAccount.get(req.params.id);
      if (account.userId !== req.user.id) {
        throw permissionDenied('Cannot set ether account for another user');
      }
      account.etherAccount = etherAccount;
      await account.save();
      req.logger.info(`Updated Ether Account for email account ${account.email}`, {
        id: account.id,
        email: account.email
      });
      res.json({
        userId: account.id,
        email: account.email,
        etherAccount
      });

      emailAccountQueue.add('setEtherAccount', {
        email, etherAccount
      });
    } catch (error) {
      next(error);
    }
  },

  async validateEmail(req, res, next) {
    const emailId = req.params.emailId;
    try {
      const message = await IncomingEmail.get(emailId)
        .getJoin({ account: true }).run();

      if (message.status !== EmailStatus.BLOCKED.name) {
        next(badRequest('Bid for email is already posted'));
      } else {
        res.json({
          id: message.id,
          email: message.account.email
        });
      }
    } catch (error) {
      req.logger.error(error, { emailId }, 'Failed while validating email');
      next(notFound('No matching email found.'));
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
