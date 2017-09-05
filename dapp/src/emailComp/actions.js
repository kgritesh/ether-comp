import { createAction } from 'redux-actions';

import config from '../config/config';
import * as actionTypes from './actionTypes';
import * as api from '../common/api';
import { APIRoutes } from '../constants/routes';
import { showSpinner, hideSpinner } from '../utils/spinner/actions';
import { getWeb3Client } from '../utils/blockchain/web3Client';
import { getEmailContract } from './emailContract';

export const validateEmailRequest = createAction(actionTypes.VALIDATE_EMAIL_REQUEST);
export const validateEmailSuccess = createAction(actionTypes.VALIDATE_EMAIL_SUCCESS);
export const validateEmailFailure = createAction(actionTypes.VALIDATE_EMAIL_FAILURE);

export const sendBidRequest = createAction(actionTypes.SEND_BID_REQUEST);
export const sendBidSuccess = createAction(actionTypes.SEND_BID_SUCCESS);
export const sendBidFailure = createAction(actionTypes.SEND_BID_FAILURE);


export function validateEmail({ emailId }) {
  return async function (dispatch) {
    dispatch(showSpinner('etherComp.bidForm.loading'));
    dispatch(validateEmailRequest({ emailId }));
    try {
      const email = await api.request(APIRoutes.validateEmail, {
        method: 'POST',
        urlParams: { emailId },
        requireAuth: false
      });
      dispatch(validateEmailSuccess(email));
    } catch (error) {
      console.log('Unable to validate Email', error, error.message);
      dispatch(validateEmailFailure(error.message));
    }
    dispatch(hideSpinner('etherComp.bidForm.loading'));
  };
}

export function sendBid(payload) {
  return async function (dispatch) {
    dispatch(showSpinner('etherComp.bidForm.loading'));
    dispatch(sendBidRequest(payload));
    const { account, privateKey, bid } = payload;
    try {
      const emailContract = await getEmailContract(config.ETHEREUM.providerUrl,
                                                   account, privateKey);

      const resp = await emailContract.sendBid(bid);
      console.log('Bid Sent successfully', resp);
      dispatch(sendBidSuccess());
    } catch (error) {
      console.error('Failed while sending bid', error);
      dispatch(sendBidFailure(error));
    }
    dispatch(hideSpinner('etherComp.bidForm.loading'));
  };
}
