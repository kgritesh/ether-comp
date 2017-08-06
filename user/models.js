import {Enum} from 'enumify';
import db from '../config/db';

const type = db.type;

export class AuthProvider extends Enum {};

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

export const AuthProviderList = AuthProvider.enumValues.map(val => val.value);

export const User = db.createModel('User', {
  id: type.string().uuid('4').required(),
  email: type.string().email().required(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  provider: type.string().required().enum(AuthProviderList),
  accessToken: type.string().optional(),
  refreshToken: type.string().optional(),
  extra: type.object().optional(),
  createdAt: type.date(),
  updatedAt: type.date(),
  lastLoginAt: type.date()
});
