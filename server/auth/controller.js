import config from '../config/config';
import { getGoogleClient, AuthProvider } from '../provider/index';
import { User } from '../user/models';
import { serializeUser } from '../user/serializers';
import * as jwt from './jwt';
import EmailEvents from '../email/signals';
import { emailAccountQueue } from '../email/tasks';

const googleConfig = config.PROVIDER.google;

export default {

  async login(req, res, next) {
    const user = req.user;
    try {
      res.json(await serializeUser(user));
    } catch (error) {
      req.logger(error, { user }, 'Unable to fetch accounts for the user');
      next(error);
    }
  },

  initGoogleAuth(req, res) {
    const googleClient = getGoogleClient();
    const url = googleClient.authorize(googleConfig.oauth2Scopes);
    res.json({ url });
  },

  async completeGoogleAuth(req, res) {
    const googleClient = getGoogleClient();
    const { authCode } = req.body;
    try {
      const { user, accessToken, refreshToken } = await googleClient.getUser(authCode);
      const { obj, created } = await User.createOrUpdateAccount({
        ...user,
        accessToken,
        refreshToken,
        provider: AuthProvider.GOOGLE.value
      });
      const msg = created ? 'New User Account created' : 'User logged in successfully';
      if (created) {
        console.log('Created New Account', obj.accounts[0].id);
        emailAccountQueue.add('enableCompService', {
          accountId: obj.accounts[0].id
        });
        EmailEvents.onAccountCreated.dispatch(obj.accounts[0]);
      }

      req.logger.info(msg, {
        id: obj.id,
        firstName: obj.firstName,
        lastName: obj.lastName,
        primaryEmail: obj.primaryEmail
      });
      const userJson = await serializeUser(obj);
      res.json({
        user: userJson,
        created,
        token: jwt.encodeUser(obj)
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Authentication Failed'
      });
    }
  }
};
