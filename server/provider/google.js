import google from 'googleapis';
import Promise from 'bluebird';

const OAuth2 = google.auth.OAuth2;
const plus = google.plus('v1');
const gmail = google.gmail('v1');

export class GmailMessage {

  static fromRegex = /<([^>]+)>/;

  constructor(message) {
    const payload = message.payload;
    const headers = payload.headers;
    delete message.payload;
    message = { ...message, ...payload };
    message.headers = headers.reduce((obj, header) => {
      obj[header.name] = header.value;
      return obj;
    }, {});
    Object.keys(message).forEach(key => {
      this[key] = message[key];
    });
  }

  get sender() {
    try {
      return this.constructor.fromRegex.exec(this.headers.From)[1];
    } catch (e) {
      return this.headers.From;
    }
  }

  get subject() {
    return this.headers.Subject;
  }

  get receiver() {
    return this.headers.To;
  }

  get date() {
    return this.headers.Date;
  }

  get emailId() {
    return this.headers['Message-ID'];
  }

  get replyTo() {
    return this.headers['In-Reply-To'];
  }

  get references() {
    return this.headers.References;
  }

  isReply() {
    return !!this.headers['In-Reply-To'];
  }

  logSerializer() {
    return {
      subject: this.subject,
      id: this.id,
      isReply: this.isReply(),
      sender: this.sender,
      replyTo: this.replyTo,
      labelIds: this.labelIds
    };
  }
}

export default class GoogleClient {
  constructor(
    clientId, clientSecret, redirectUrl,
    accessToken = null, refreshToken = null) {
    this.client = new OAuth2(clientId, clientSecret, redirectUrl);
    if (accessToken) {
      this.client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    }
  }

  authorize(scopes) {
    return this.client.generateAuthUrl({
      access_type: 'offline',
      approval_prompt: 'force',
      scope: scopes
    });
  }

  async getUser(authCode) {
    const token = await this._getToken(authCode);
    this.client.setCredentials(token);
    const user = await this._getUserDetails({ userId: 'me', auth: this.client });
    return {
      user: {
        email: user.emails[0].value,
        firstName: user.name.givenName,
        lastName: user.name.familyName
      },
      accessToken: token.access_token,
      refreshToken: token.refresh_token
    };
  }

  registerEmailListener(topic, labelIds = []) {
    const options = {
      userId: 'me',
      auth: this.client,
      resource: {
        topicName: topic
      }
    };
    if (labelIds && labelIds.length > 0) {
      options.resource.labelIds = labelIds;
      options.resource.labelFilterAction = 'include';
    }

    return this._watchEmail(options);
  }

  async createLabels(labels) {
    const response = [];
    await Promise.all(
      Promise.map(labels, label => this.createLabel(label).reflect())
    ).each(inspection => {
      if (inspection.isFulfilled()) {
        response.push({
          error: null,
          label: inspection.value()
        });
      } else {
        response.push({
          error: inspection.reason(),
          label: null
        });
      }
    });

    return response;
  }

  createLabel(label, labelVisible = true, messageVisible = true) {
    const options = {
      userId: 'me',
      auth: this.client,
      resource: {
        name: label,
        labelListVisibility: labelVisible ? 'labelShowIfUnread' : 'labelHide',
        messageListVisibility: messageVisible ? 'show' : 'hide'
      }
    };
    return this._createLabel(options);
  }

  async getLabels(filter = null) {
    const options = {
      userId: 'me',
      auth: this.client
    };

    const response = await this._getAllLabels(options);
    const labels = response.labels;
    if (filter) {
      return labels.filter(label => filter.indexOf(label.name) >= 0);
    }
    return labels;

  }

  async getNewMessages(historyId, labelId = null) {
    const options = {
      userId: 'me',
      auth: this.client,
      historyTypes: 'messageAdded',
      startHistoryId: historyId.toString()
    };
    if (labelId) {
      options.labelId = labelId;
    }
    const response = await this._getHistoryList(options);
    const messages = [];
    const history = response.history || [];
    history.forEach(hist => {
      hist.messagesAdded.forEach(msg => messages.push({
        id: msg.message.id,
        labelIds: msg.message.labelIds,
        threadId: msg.message.threadId
      }));
    });
    return { messages, historyId: response.historyId };
  }

  async getMessage(messageId) {
    const options = {
      userId: 'me',
      id: messageId,
      auth: this.client
    };
    const message = await this._getMessage(options);
    return new GmailMessage(message);
  }

  updateMessageLabels(messageId, addLabelIds, removeLabelIds) {
    const options = {
      userId: 'me',
      id: messageId,
      auth: this.client,
      resource: {
        addLabelIds,
        removeLabelIds
      }
    };
    return this._modifyMessage(options);
  }

  sendEmail({ from, subject, message, to = null, cc = null,
    bcc = null, threadId = null, headers = {} }) {

    const raw = this._makeEmailBody({ from, subject, message, to, bcc, cc, headers });
    const options = {
      userId: 'me',
      auth: this.client,
      resource: {
        raw,
        threadId
      }
    };

    return this._sendMessage(options);
  }

  _makeEmailBody({ from, subject, message, to = null, cc = null,
    bcc = null, headers = {} }) {

    const headerList = Object.keys(headers).map((key) => `${key}: ${headers[key]}`);

    const body = [
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      'Content-Transfer-Encoding: 7bit',
      ...headerList,
      `from: ${from}`,
      `subject: ${subject}`,
    ];

    if (to) {
      body.push(`to: ${to}`);
    }

    if (cc) {
      body.push(`cc: ${cc}`);
    }

    if (bcc) {
      body.push(`bcc: ${bcc}`);
    }
    body.push('');
    body.push(message);
    const str = body.join('\n');
    return new Buffer(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  }

  _watchEmail(options) {
    const watchEmail = Promise.promisify(gmail.users.watch, { context: gmail.users });
    return watchEmail(options);
  }

  _getToken(authCode) {
    const getToken = Promise.promisify(this.client.getToken, { context: this.client });
    return getToken(authCode);
  }

  _getUserDetails(auth) {
    const getUserDetails = Promise.promisify(plus.people.get, { context: gmail.user });
    return getUserDetails(auth);
  }

  _createLabel(options) {
    const createLabel = Promise.promisify(gmail.users.labels.create, {
      context: gmail.users.labels
    });
    return createLabel(options);
  }

  _getAllLabels(options) {
    const getAllLabels = Promise.promisify(gmail.users.labels.list, {
      context: gmail.users.labels
    });
    return getAllLabels(options);
  }

  _getHistoryList(options) {
    const getHistoryList = Promise.promisify(gmail.users.history.list, {
      context: gmail.users.history
    });
    return getHistoryList(options);
  }

  _getMessage(options) {
    const getMessage = Promise.promisify(gmail.users.messages.get, {
      context: gmail.users.messages
    });
    return getMessage(options);
  }

  _modifyMessage(options) {
    const modifyMessage = Promise.promisify(gmail.users.messages.modify, {
      context: gmail.users.messages
    });
    return modifyMessage(options);
  }

  _sendMessage(options) {
    const sendMessage = Promise.promisify(gmail.users.messages.send, {
      context: gmail.users.messages
    });
    return sendMessage(options);
  }

}
