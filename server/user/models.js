import uuidv4 from 'uuid/v4';
import { Enum } from 'enumify';

import db from '../config/db';
import { BaseModel } from '../common/models';
import { Model } from '../utils/orm';

const type = db.type;

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

export const AuthProviderList = AuthProvider.enumValues.map(val => val.value);

@Model(db)
export class User extends BaseModel {
  static schema = {
    email: type.string().email().required(),
    firstName: type.string().required(),
    lastName: type.string().required(),
    provider: type.string().required().enum(AuthProviderList),
    accessToken: type.string().optional(),
    refreshToken: type.string().optional(),
    extra: type.object().optional(),
    lastLoginAt: type.date()
  };

  static indices = ['email'];
}
