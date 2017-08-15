import config from '../config/config';
import { getGoogleClient } from '../provider/index';
import { User, AuthProvider } from '../user/models';
import logger from '../config/logger';

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
      const result = await User.createOrUpdate('email', {
        ...user,
        accessToken,
        refreshToken,
        provider: AuthProvider.GOOGLE.value
      });
      req.logger.info('User logged in successfully', result);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Authentication Failed'
      });
    }
  }
};
