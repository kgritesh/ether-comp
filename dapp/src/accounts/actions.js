import { createAction } from 'redux-actions';
import { NotificationManager } from 'react-notifications';

import config from '../config/config';
import * as actionTypes from './actionTypes';
import * as api from '../common/api';
import { APIRoutes } from '../constants/routes';
import { showSpinner, hideSpinner } from '../utils/spinner/actions';


export const setEtherAccountRequest = createAction(actionTypes.SET_ETHER_ACCOUNT_REQUEST);
export const setEtherAccountSuccess = createAction(actionTypes.SET_ETHER_ACCOUNT_SUCCESS);
export const setEtherAccountFailure = createAction(actionTypes.SET_ETHER_ACCOUNT_FAILURE);


export function setEtherAccount(payload) {
  return async function (dispatch) {
    dispatch(showSpinner('account.setEtherAccount'));
    dispatch(setEtherAccountRequest());
    try {
      const resp = await api.request(APIRoutes.setEtherAccount, {
        method: 'POST',
        payload,
        urlParams: { id: payload.id }
      });
      dispatch(setEtherAccountSuccess(resp));
      NotificationManager.info('Updated ether account for the ');
    } catch (err) {
      NotificationManager.error('Failed to update user profile');
      dispatch(setEtherAccountFailure(err));
    }
    dispatch(hideSpinner('account.setEtherAccount'));
  };
}
