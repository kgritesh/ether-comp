import Promise from 'bluebird';

import BaseCompService from './service';
import { AuthProvider } from '../provider/index';
import { IncomingEmail, EmailStatus } from './models';

export default class GmailService extends BaseCompService {

  static PROVIDER = AuthProvider.GOOGLE.value;

  static INBOX_LABEL = 'INBOX';
  static OUTBOX_LABEL = 'SENT';

  async enableService() {
    this.logger.debug('Enabling Comp Service');
    const { account, logger } = this;
    let [inboxLabelId, outboxLabelId,
         blockLabelId, compLabelId] = await this._getAllLabels();

    if (!blockLabelId) {
      blockLabelId = await this._createLabel(this.account.blockLabel.name);
    }

    if (!compLabelId) {
      compLabelId = await this._createLabel(this.account.compLabel.name);
    }

    const watchLabelIds = [inboxLabelId, outboxLabelId];
    const { historyId, expiration } = await this._registerEmailListener(
      watchLabelIds);

    account.historyId = historyId;
    account.watchExpiry = new Date(parseInt(expiration, 10));
    account.blockLabel.id = blockLabelId;
    account.compLabel.id = compLabelId;
    account.inboxLabel = {
      name: this.constructor.INBOX_LABEL,
      id: inboxLabelId
    };

    account.outboxLabel = {
      name: this.constructor.OUTBOX_LABEL,
      id: outboxLabelId
    };
    try {
      await account.save();
      logger.info('Enabled Ether Comp Service successfully');
    } catch (error) {
      logger.error(error, 'Failed while updating account during enable service');
    }
    return null;
  }

  async processNewEmails() {
    const { messages, historyId } = await this._getNewEmails(this.account.historyId);
    if (messages.length > 0) {
      this.logger.info({ historyId },
        `Fetched ${messages.length} messages`);
      await Promise.all(
        Promise.map(messages, msg => this.processNewEmail(msg))
      );
      this.logger.info({ historyId }, `Processed All ${messages.length} messages`);
    } else {
      this.logger.info('No new messages added. History Event can be ignored');
    }

    this.account.historyId = historyId;
    try {
      await this.account.save();
      this.logger.info('Updated account historyId');
    } catch (error) {
      this.logger.error(error, 'Failed while updating account historyId');
    }
    return null;
  }

  async processNewEmail(message) {
    const { account } = this;
    try {
      const email = await this.client.getMessage(message.id);
      this.logger.debug({ email },
        'Processing Message with subject: %s and labels: %s',
        email.subject, email.labelIds);

      if (email.labelIds.indexOf(account.inboxLabel.id) >= 0) {
        return this._processIncomingEmail(email);
      } else if (email.labelIds.indexOf(account.outboxLabel.id) >= 0) {
        return this._processSentEmail(email);
      }
      return Promise.resolve(null);
    } catch (error) {
      this.logger.error(error, {
        messageId: message.id,
        labels: message.labelIds
      }, 'Failed while process new email event');
    }
    return Promise.resolve(null);
  }

  async moveEmailToComp(messageId) {
    try {
      const email = await this.client.getMessage(messageId);
      await this._moveToInbox(email);
    } catch (error) {
      this.logger.error(error, {
        messageId
      }, 'Failed while applying comp label to email');
    }
  }

  async _processIncomingEmail(email) {
    if (email.sender !== 'ritesh@loanzen.in') {
      return Promise.resolve(null);
    }
    await this._addBlockLabel(email);
    await this._sendAutoReply(email);
    return this._createIncomingEmail(email);
  }

  async _processSentEmail(email) {

    if (email.isReply() && !email.headers['X-Automated']) {
      const replyTo = email.replyTo;
      this.logger.debug({ email }, 'Email is a reply');
      try {
        const parentMail = await IncomingEmail.filterOne({ emailId: replyTo });
        if (parentMail.status !== EmailStatus.PAID.name) {
          this.logger.debug({ email }, 'User has replied to a paid email. Must initiate Payment');
          parentMail.status = EmailStatus.REPLIED.name;
          parentMail.replyMessageId = email.id;
          parentMail.save();
          this.initiateCompPayment(parentMail);
        }
      } catch (error) {
      }
    }
    return Promise.resolve(null);
  }

  async _registerEmailListener(labelIds) {

    try {
      const resp = await this.client.registerEmailListener(
        this.config.pubSubTopic, labelIds);
      this.logger.debug(resp, 'Successfully registered email listener for', labelIds);
      return resp;
    } catch (error) {
      error.message = `Unable to register gmail email Listener for account: ${this.account.email}. ${error.message}`;
      throw error;
    }
  }

  async _createLabel(label) {
    const { logger } = this;
    try {
      const response = await this.client.createLabel(label);
      logger.info(`Created Label ${response.name} successfully`);
      return response.id;

    } catch (error) {
      logger.error(error, `Failed to create label: ${label}`);
      return null;
    }
  }

  async _getAllLabels() {
    const inboxLabel = this.constructor.INBOX_LABEL;
    const outboxLabel = this.constructor.OUTBOX_LABEL;
    const labelList = [
      inboxLabel, outboxLabel, this.account.blockLabel.name,
      this.account.compLabel.name
    ];

    const labelIdList = [null, null, null, null];
    const labels = await this.client.getLabels(labelList);
    labels.forEach((label) => {
      const index = labelList.indexOf(label.name);
      labelIdList[index] = label.id;
    });

    this.logger.info('Fetched Inbox and Outbox label id');
    return labelIdList;

  }

  async _getNewEmails(historyId) {
    try {
      const labelId = this.account.inboxLabel.id || null;
      const resp = await this.client.getNewMessages(historyId);
      this.logger.debug(`Received ${resp.messages.length} new messages`);
      return resp;
    } catch (error) {
      error.message = `Unable to fetch new emails for history Id: ${historyId}. ${error.message}`;
      throw error;
    }
  }

  async _addBlockLabel(message) {
    const { inboxLabel, blockLabel } = this.account;

    if (!inboxLabel.id || !blockLabel.id) {
      const msg = 'Cannot Apply label to message as either inbox or block labels are missing';
      this.logger.error(msg);
      throw new Error(msg);
    }
    try {
      await this.client.updateMessageLabels(
        message.id, [blockLabel.id], [inboxLabel.id]);
      this.logger.info(`Updated Message Label. Removed ${inboxLabel.name} and added ${blockLabel.name}`);
    } catch (error) {
      error.message = `Unable to modify labels for message ${message}. ${error.message}`;
      this.logger.error(error);
      throw error;
    }
  }

  async _moveToInbox(email) {
    const { inboxLabel, blockLabel, compLabel } = this.account;

    if (!inboxLabel.id && !compLabel.id) {
      const msg = 'Cannot Apply label to message as either inbox or block labels are missing';
      this.logger.error(msg);
      throw new Error(msg);
    }
    try {
      await this.client.updateMessageLabels(
        email.id, [inboxLabel.id, compLabel.id], [blockLabel.id]);
      this.logger.info(`Updated Message Label. Removed ${blockLabel.name} and added ${inboxLabel.name} as well as ${compLabel.name}`);
    } catch (error) {
      error.message = `Unable to modify labels for message ${email.message}. ${error.message}`;
      this.logger.error(error);
      throw error;
    }
  }

  async _sendAutoReply(email) {
    const from = this.account.email;
    const to = email.sender;
    const subject = email.subject;
    const message = this.account.responseTemplate;
    const threadId = email.threadId;
    const headers = {
      References: email.emailId,
      'In-Reply-To': email.emailId,
      'X-Automated': true
    };
    const resp = await this.client.sendEmail(
      { from, to, subject, message, threadId, headers }
    );
    this.logger.info(resp, `Sent Auto Reply to: ${to}`);
    return resp;
  }

  _createIncomingEmail(email) {
    return IncomingEmail.create({
      emailAccountId: this.account.id,
      emailId: email.emailId,
      threadId: email.threadId,
      messageId: email.id,
      senderEmail: email.sender,
      status: EmailStatus.BLOCKED.name
    });
  }

}
