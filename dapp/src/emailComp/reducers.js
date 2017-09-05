import Immutable from 'immutable';
import { handleActions } from 'redux-actions';

import * as actionTypes from './actionTypes';

const initialState = Immutable.fromJS({
  isValidating: false,
  validationError: null,
  email: Immutable.fromJS({}),
  isBidProcessing: false,
  bidStatus: null
});


function onValidateEmailRequest(state) {
  return state.set('isValidating', true);
}

function onValidateEmailFailure(state, action) {
  return state.merge({
    validationError: action.payload,
    isValidating: false
  });
}

function onValidateEmailSuccess(state, action) {
  return state.merge({
    email: Immutable.fromJS(action.payload),
    isValidating: false
  });
}

function onBidRequest(state) {
  return state.set('isBidProcessing', true);
}

function onBidSuccess(state) {
  return state.merge({
    bidStatus: Immutable.fromJS({
      success: true,
      error: null
    }),
    isBidProcessing: false
  });
}

function onBidFailure(state, action) {
  return state.merge({
    bidStatus: Immutable.fromJS({
      success: false,
      error: action.payload
    }),
    isBidProcessing: false
  });
}


const emailCompReducer = handleActions({
  [actionTypes.VALIDATE_EMAIL_REQUEST]: onValidateEmailRequest,
  [actionTypes.VALIDATE_EMAIL_SUCCESS]: onValidateEmailSuccess,
  [actionTypes.VALIDATE_EMAIL_FAILURE]: onValidateEmailFailure,
  [actionTypes.SEND_BID_REQUEST]: onBidRequest,
  [actionTypes.SEND_BID_SUCCESS]: onBidSuccess,
  [actionTypes.SEND_BID_FAILURE]: onBidFailure
}, initialState);

export default emailCompReducer;
