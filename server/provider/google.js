import google from 'googleapis';
import Promise from 'bluebird';

const OAuth2 = google.auth.OAuth2;
const plus = google.plus('v1');
const gmail = google.gmail('v1');


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

  _getToken(authCode) {
    const getToken = Promise.promisify(this.client.getToken.bind(this.client));
    return getToken(authCode);
  }

  _getUserDetails(auth) {
    const getUserDetails = Promise.promisify(plus.people.get.bind(plus.people));
    return getUserDetails(auth);
  }
}
