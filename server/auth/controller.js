import config from '../config/config';
import { getGoogleClient } from '../provider/index';
import { User, AuthProvider } from '../user/models';
import * as jwt from './jwt';

const googleConfig = config.PROVIDER.google;

export default {

  initGoogleAuth(req, res) {
    const googleClient = getGoogleClient();
    const url = googleClient.authorize(googleConfig.oauth2Scopes);
    res.json({ url });
  },

  async completeGoogleAuth(req, res) {
    const googleClient = getGoogleClient();
    try {
      const { user, accessToken, refreshToken } = await googleClient.getUser(req.query.code);
      const { obj, created } = await User.createOrUpdateAccount({
        ...user,
        accessToken,
        refreshToken,
        provider: AuthProvider.GOOGLE.value
      });
      const msg = created ? 'New User Account created' : 'User logged in successfully';
      req.logger.info(msg, {
        id: obj.id,
        firstName: obj.firstName,
        lastName: obj.lastName,
        primaryEmail: obj.primaryEmail
      });
      res.json({
        userId: obj.id,
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
