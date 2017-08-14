import urljoin from 'urljoin';

import config from '../config/config';
import GoogleClient from './google';

const googleConfig = config.PROVIDER.google;

export function getGoogleClient({ accessToken = null, refreshToken = null } = {}) {
  const redirectUrl = urljoin(config.BASE_URL, googleConfig.oauth2RedirectUrl);
  return new GoogleClient(
    googleConfig.clientId, googleConfig.clientSecret, redirectUrl,
    accessToken, refreshToken);
}
