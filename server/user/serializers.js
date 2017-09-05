import { EmailAccount } from '../email/models';

import { serializeAccount } from '../email/serializers';

export async function serializeUser(user) {
  const accounts = await EmailAccount.filter({ userId: user.id }).run();
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    primaryEmail: user.primaryEmail,
    accounts: accounts.map(acc => serializeAccount(acc))
  };
}
