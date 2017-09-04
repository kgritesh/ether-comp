import Immutable from 'immutable';
import { handleActions } from 'redux-actions';

import * as actionTypes from './actionTypes';

const initialState = Immutable.fromJS({
  isValidating: false,
  email: Immutable.fromJS({}),
});


function onValidateEmailRequest(state) {
  return state.set('isValidating', true);
}

function onValidateEmailFailure(state) {
  return state.set('isValidating', false);
}

function onValidateEmailSuccess(state, action) {
  return state.merge({
    email: Immutable.fromJS(action.payload),
    isValidating: false
  });
}

const emailCompReducer = handleActions({
  [actionTypes.VALIDATE_EMAIL_REQUEST]: onValidateEmailRequest,
  [actionTypes.VALIDATE_EMAIL_SUCCESS]: onValidateEmailSuccess,
  [actionTypes.VALIDATE_EMAIL_FAILURE]: onValidateEmailFailure,
}, initialState);

export default emailCompReducer;
