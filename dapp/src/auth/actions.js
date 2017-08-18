import { createAction } from 'redux-actions';
import { push } from  'react-router-redux';

import * as actionTypes from './actionTypes';
import * as api from '../common/api';
import { APIRoutes } from '../constants/routes';

export const startAuthRequest = createAction(actionTypes.START_AUTH_REQUEST);
export const startAuthSuccess = createAction(actionTypes.START_AUTH_SUCCESS);
export const startAuthFailure = createAction(actionTypes.START_AUTH_FAILURE);

export const completeAuthRequest = createAction(actionTypes.COMPLETE_AUTH_REQUEST);
export const completeAuthSuccess = createAction(actionTypes.COMPLETE_AUTH_SUCCESS);
export const completeAuthFailure = createAction(actionTypes.COMPLETE_AUTH_FAILURE);

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
