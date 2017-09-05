import Cookie from 'js-cookie';
import { createAction } from 'redux-actions';
import { NotificationManager } from 'react-notifications';

import config from '../config/config';
import * as actionTypes from './actionTypes';
import * as api from '../common/api';
import { APIRoutes } from '../constants/routes';
import { showSpinner, hideSpinner } from '../utils/spinner/actions';

export const loginRequest = createAction(actionTypes.LOGIN_REQUEST);
export const loginSuccess = createAction(actionTypes.LOGIN_SUCCESS);
export const loginFailure = createAction(actionTypes.LOGIN_FAILURE);

export const startAuthRequest = createAction(actionTypes.START_AUTH_REQUEST);
export const startAuthSuccess = createAction(actionTypes.START_AUTH_SUCCESS);
export const startAuthFailure = createAction(actionTypes.START_AUTH_FAILURE);

export const completeAuthRequest = createAction(actionTypes.COMPLETE_AUTH_REQUEST);
export const completeAuthSuccess = createAction(actionTypes.COMPLETE_AUTH_SUCCESS);
export const completeAuthFailure = createAction(actionTypes.COMPLETE_AUTH_FAILURE);

export function login() {
  return async function (dispatch) {
    dispatch(showSpinner('auth.login'));
    dispatch(loginRequest());
    try {
      const resp = await api.request(APIRoutes.login, {
        method: 'POST'
      });
      dispatch(loginSuccess(resp));
    } catch (err) {
      console.error(err);
      dispatch(loginFailure(err));
    }
    dispatch(hideSpinner('auth.login'));
  };
}

export function initiateAuth(provider) {
  return async function (dispatch) {
    dispatch(startAuthRequest({ provider }));
    try {
      const resp = await api.request(APIRoutes.startAuth, {
        method: 'POST',
        urlParams: { provider },
        requireAuth: false
      });
      dispatch(startAuthSuccess(resp));
      window.location.href = resp.url;
    } catch (err) {
      console.error(err);
      dispatch(startAuthFailure(err));
    }
  };
}

export function completeGoogleAuth(payload) {
  return async function (dispatch) {
    dispatch(showSpinner('auth.loading'));
    dispatch(completeAuthRequest(payload));
    try {
      const resp = await api.request(APIRoutes.completeAuth, {
        method: 'POST',
        urlParams: { provider: 'google' },
        requireAuth: false,
        payload
      });
      Cookie.set(config.JWT.cookie, resp.token, {
        domain: config.JWT.domain,
        expiry: config.JWT.expiry
      });
      dispatch(completeAuthSuccess(resp));
      dispatch(hideSpinner('auth.loading'));
    } catch (err) {
      console.error(err);
      dispatch(completeAuthFailure(err));
    }
  };
}

export const updateUserRequest = createAction(actionTypes.UPDATE_USER_REQUEST);
export const updateUserSuccess = createAction(actionTypes.UPDATE_USER_SUCCESS);
export const updateUserFailure = createAction(actionTypes.UPDATE_USER_FAILURE);

export function updateUser(payload) {
  return async function (dispatch) {
    dispatch(showSpinner('app.updateUser'));
    dispatch(updateUserRequest());
    try {
      const resp = await api.request(APIRoutes.updateUser, {
        method: 'POST',
        payload,
        urlParams: { id: payload.id }
      });
      dispatch(updateUserSuccess(resp));
      NotificationManager.info('User Profile Updated');
    } catch (err) {
      NotificationManager.error('Failed to update user profile');
      dispatch(updateUserFailure(err));
    }
    dispatch(hideSpinner('app.updateUser'));
  };
}
