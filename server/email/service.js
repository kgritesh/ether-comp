import { getProviderClient } from '../provider/index';
import config from '../config/config';

export default class BaseCompService {

  static PROVIDER = 'base';

  constructor(account, logger) {
    if (new.target === BaseCompService) {
      throw new TypeError('Cannot create base comp service directly');
    }
    this.provider = this.constructor.PROVIDER;
    this.account = account;
    this.client = getProviderClient(this.provider, this.account.getTokens());
    this.config = config.getProviderConfig(this.provider);
    this.logger = logger.child({
      provider: this.provider,
      userId: account.userId,
      accountId: account.id,
      email: account.email,
      active: account.active
    });
  }

  enableService() {
  }

  processNewEmails() {}

  _registerEmailListener() {}

  _createLabels() {}

  _getNewEmails() {}
}
