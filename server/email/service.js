import { getProviderClient } from '../provider/index';
import config from '../config/config';

import { emailCompContract } from '../blockchain/index';

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
    this.logger = logger.child(account.logSerializer());
  }

  enableService() {
  }

  processNewEmails() {}

  async initiateCompPayment(incomingEmail) {
    try {
      await emailCompContract.payBid(this.account.email, incomingEmail.id);
    } catch (error) {
      this.logger.error(error, { incomingEmail }, 'Failed to initiate comp payment');
    }
  }

  _registerEmailListener() {}

  _createLabels() {}

  _getNewEmails() {}


}
