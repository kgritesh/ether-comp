import { AuthProvider } from '../provider/index';
import GmailService from './gmail';

export function getCompService(account, logger) {
  let serviceCls;
  switch (account.provider) {
    case AuthProvider.GOOGLE.value:
      serviceCls = GmailService;
      break;
  }
  return new serviceCls(account, logger);

}
