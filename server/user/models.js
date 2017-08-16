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
export class EmailAccount extends BaseModel {
  static schema = {
    userId: type.string().uuid('4').required(),
    email: type.string().email().required(),
    provider: type.string().required().enum(AuthProviderList),
    accessToken: type.string().optional(),
    refreshToken: type.string().optional(),
    active: type.boolean().default(false)
  }

  static indices = ['email'];
}


@Model(db)
export class User extends BaseModel {
  static schema = {
    primaryEmail: type.string().email().required(),
    firstName: type.string().required(),
    lastName: type.string().required(),
    extra: type.object().optional(),
    lastLoginAt: type.date()
  };

  static createOrUpdateAccount = async function ({
    email, provider, accessToken, refreshToken, ...props }) {

    const users = await User.getJoin({ accounts: true }).filter(user => (
      user('accounts').contains(acc => acc('email').eq(email))
    )).run();
    if (users.length > 0) {
      const user = users[0];
      const account = user.accounts[0];
      user.lastLoginAt = new Date();
      account.accessToken = accessToken;
      if (refreshToken) {
        account.refreshToken = refreshToken;
      }
      await user.saveAll();
      return { obj: user, created: false };
    }
    const user = new User({
      ...props,
      primaryEmail: email,
      lastLoginAt: new Date(),
      accounts: [
        { email, provider, accessToken, refreshToken }
      ]
    });
    await user.saveAll();
    return { obj: user, created: true };
  }
}


User.hasMany(EmailAccount, 'accounts', 'id', 'userId');
EmailAccount.belongsTo(User, 'user', 'userId', 'id');
