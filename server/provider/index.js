import urljoin from 'url-join';

import { Enum } from '../common/utils';
import config from '../config/config';
import GoogleClient from './google';

const googleConfig = config.PROVIDER.google;

export class AuthProvider extends Enum {}

AuthProvider.initEnum({
  GOOGLE: {
    label: 'Google',
    value: 'GOOGLE'
  },
  YAHOO: {
    label: 'Yahoo',
    value: 'YAHOO'
  },
  OUTLOOK: {
    label: 'Microsoft Outlook',
    value: 'OUTLOOK'
  }
});

export const AuthProviderList = AuthProvider.names;

export function getGoogleClient({ accessToken = null, refreshToken = null } = {}) {
  const redirectUrl = urljoin(config.FRONTEND_URL, googleConfig.oauth2RedirectUrl);
  return new GoogleClient(
    googleConfig.clientId, googleConfig.clientSecret, redirectUrl,
    accessToken, refreshToken);
}


export function getProviderClient(provider, tokens) {
  if (provider === AuthProvider.GOOGLE.value) {
    return getGoogleClient(tokens);
  }
  return null;
}
