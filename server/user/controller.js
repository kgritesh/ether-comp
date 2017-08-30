import { EmailAccount } from '../email/models';
import { permissionDenied } from '../common/errors';
import { emailAccountQueue } from '../email/tasks';

export default {
  async setEtherAccount(req, res, next) {
    if (req.user.id !== req.params.id) {
      next(permissionDenied('Permission Denied'));
    }
    try {
      const { email, etherAccount } = req.body;
      const account = await EmailAccount.fetchByEmail(email);
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
  }
};
