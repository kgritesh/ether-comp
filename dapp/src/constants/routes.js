import { APIRoutes as authAPIRoutes } from '../auth/routes';
import { APIRoutes as emailAPIRoutes } from '../emailComp/routes';
import { APIRoutes as accountRoutes } from '../accounts/routes';


export const AppRoutes = {
  login: '/auth/login',
  google: {
    authComplete: '/auth/google/complete/'
  },
  home: '/',
  userProfile: '/',
  emailAccounts: '/accounts',
  logout: '/auth/logout',
  emailBidForm: '/email/:emailId/bid'
};


export const APIRoutes = {
  ...authAPIRoutes, ...emailAPIRoutes, ...accountRoutes
};
