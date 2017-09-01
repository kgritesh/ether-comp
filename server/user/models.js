import db from '../config/db';
import { BaseModel } from '../common/models';
import { Model } from '../utils/orm';

const type = db.type;

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
      const obj = await user.saveAll();
      return { obj, created: false };
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

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  logSerializer() {
    return {
      id: this.id,
      primaryEmail: this.primaryEmail,
      fullName: this.fullName
    };
  }

}
