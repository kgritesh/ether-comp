import Immutable from 'immutable';
import { handleActions } from 'redux-actions';

import * as actionTypes from './actionTypes';

const initialState = Immutable.fromJS({
  isAuthenticated: false,
  user: null,
  isCreated: null,
  isAuthenticating: true
});

function loginRequest(state) {
  return state.set('isAuthenticating', true);
}

function loginSuccess(state, action) {
  return state.merge({
    isAuthenticated: true,
    isAuthenticating: false,
    isCreated: false,
    user: Immutable.fromJS(action.payload)
  });
}

function loginFailure(state) {
  return state.set('isAuthenticating', false);
}

function updateUserSuccess(state, action) {
  return state.set('user', Immutable.fromJS(action.payload));
}

function compAuthSuccess(state, action) {
  const { created, user } = action.payload;
  return state.merge({
    isAuthenticated: true,
    isCreated: created,
    user: Immutable.fromJS(user)
  });
}

const authReducer = handleActions({
  [actionTypes.LOGIN_REQUEST]: loginRequest,
  [actionTypes.LOGIN_SUCCESS]: loginSuccess,
  [actionTypes.LOGIN_FAILURE]: loginFailure,
  [actionTypes.COMPLETE_AUTH_SUCCESS]: compAuthSuccess,
  [actionTypes.UPDATE_USER_SUCCESS]: updateUserSuccess
}, initialState);

export default authReducer;
