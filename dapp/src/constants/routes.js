import { APIRoutes as authAPIRoutes } from '../auth/routes';

export const AppRoutes = {
  login: '/auth/login',
  home: '/',
  logout: '/auth/logout'
};


export const APIRoutes = {
  ...authAPIRoutes
};
