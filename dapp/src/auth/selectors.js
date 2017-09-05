import * as utils from '../utils/utils';

export const isAuthenticated = state => state.auth.get('isAuthenticated') || false;

export const getUser = state => utils.immutableToJS(state.auth.get('user'));
