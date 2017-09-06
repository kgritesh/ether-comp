import * as utils from '../utils/utils';

export const isAuthenticated = state => state.auth.get('isAuthenticated') || false;

export const getUser = state => utils.immutableToJS(state.auth.get('user'));

export const getAccounts = (state) => {
  const user = getUser(state);
  console.log('Get Accounts', user.accounts);
  return user.accounts;
};
