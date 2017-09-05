import fs from 'fs';
import template from 'lodash/template';
import urljoin from 'url-join';

import { Enum } from '../common/utils';
import db from '../config/db';
import { Model } from '../utils/orm';
import { BaseModel } from '../common/models';
import { User } from '../user/models';
import { AuthProviderList } from '../provider/index';


const type = db.type;

const blockResponse = fs.readFileSync('common/templates/blockResponse.txt', 'utf-8');


export class EmailStatus extends Enum {}
EmailStatus.initEnum([
  'BLOCKED', 'BID', 'REPLIED', 'PAID',
  'CANCELLED', 'EXPIRED', 'PAYMENT_FAILED'
]);


@Model(db)
export class EmailAccount extends BaseModel {
  static schema = {
    userId: type.string().uuid('4').required(),
    email: type.string().email().required(),
    provider: type.string().required().enum(AuthProviderList),
    accessToken: type.string().optional(),
    refreshToken: type.string().optional(),
    active: type.boolean().default(false),
    minBid: type.number().default(0),
    historyId: type.string(),
    watchExpiry: type.date(),
    // Auto Response for blocked email
    responseTemplate: type.string().default(blockResponse),

    // Label to apply to email which are blocked by ether-comp
    blockLabel: type.object().schema({
      name: type.string().default('block'),
      id: type.string()
    }).default({}),

    // Label to apply to email which people have paid for
    compLabel: type.object().schema({
      name: type.string().default('paid'),
      id: type.string()
    }).default({}),

    inboxLabel: type.object().schema({
      name: type.string(),
      id: type.string()
    }).default({}),

    outboxLabel: type.object().schema({
      name: type.string(),
      id: type.string()
    }).default({}),
    etherAccount: type.string()
  }

  static indices = ['email', 'userId'];

  getTokens() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken
    };
  }

  static async fetchByEmail(email) {
    const accounts = await this.getAll(email, { index: 'email' }).run();
    if (accounts.length === 1) {
      return accounts[0];
    } else if (accounts.length > 1) {
      throw new Error(`More than 1 email account found with email id :${email}`);
    } else {
      throw new Error(`No email account found with email id :${email}`);
    }
  }

  logSerializer() {
    return {
      id: this.id,
      provider: this.provider,
      active: this.active,
      userId: this.userId,
      email: this.email
    };
  }

  getAutoResponse(context) {
    const compiled = template(this.responseTemplate);
    return compiled(context);
  }
}

User.hasMany(EmailAccount, 'accounts', 'id', 'userId');
EmailAccount.belongsTo(User, 'user', 'userId', 'id');


@Model(db)
export class IncomingEmail extends BaseModel {
  static schema = {
    emailAccountId: type.string().uuid('4').required(),
    // This is the actual id inside the email header
    emailId: type.string().required(),
    // This is the provider id for the email.
    messageId: type.string().required(),
    threadId: type.string(),
    subject: type.string(),
    senderEmail: type.string().email().required(),
    senderAddr: type.string(),
    status: type.string().required()
      .enum(EmailStatus.names)
      .default(EmailStatus.BLOCKED.name),

    bid: type.number(),
    // Expiry in days
    expiry: type.number().default(7),
    bidOn: type.date(),


    replyMessageId: type.string()
  }

  static indices = ['emailAccountId', 'messageId', 'senderEmail', 'emailId'];

  logSerializer() {
    return {
      id: this.id,
      messageId: this.messageId,
      status: this.status,
      senderEmail: this.senderEmail,
      accountId: this.emailAccountId
    };
  }

  getBidUrl(baseUrl) {
    return urljoin(baseUrl, `/email/${this.id}/bid/`);
  }
}

EmailAccount.hasMany(IncomingEmail, 'emails', 'id', 'emailAccountId');
IncomingEmail.belongsTo(EmailAccount, 'account', 'emailAccountId', 'id');
