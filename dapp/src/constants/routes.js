import { APIRoutes as authAPIRoutes } from '../auth/routes';

export const AppRoutes = {
  login: '/auth/login',
  google: {
    authComplete: '/auth/google/complete/'
  },
  home: '/',
  userProfile: '/',
  emailAccounts: '/accounts',
  logout: '/auth/logout'
};


export const APIRoutes = {
  ...authAPIRoutes
};
