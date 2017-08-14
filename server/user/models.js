import uuidv4 from 'uuid/v4';
import {Enum} from 'enumify';
import db from '../config/db';

const type = db.type;
const r = db.r;

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

export const User = db.createModel('User', {
  id: type.string().uuid('4').required().default(() => uuidv4()),
  email: type.string().email().required(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  provider: type.string().required().enum(AuthProviderList),
  accessToken: type.string().optional(),
  refreshToken: type.string().optional(),
  extra: type.object().optional(),
  createdAt: type.date().default(r.now()),
  updatedAt: type.date(),
  lastLoginAt: type.date()
});

User.ensureIndex('email');

User.pre('save', function () {
  this.updatedAt = new Date();
});


User.create = function create(props) {
  const user = new User(props);
  return user.save();
};


User.createOrUpdate = async function createorUpdate({ email, ...props }) {
  const exists = await User.filter({ email }).count().gt(0).branch(true, false).execute();
  if (exists) {
    console.log('User already exists with this email id', email);
    const user = await User.filter({ email }).run().then(
      users => users[0].merge(props).save());
    return user;
  }
  console.log('New User', email);
  const user = await User.create({ email, ...props });
  return user;
};
