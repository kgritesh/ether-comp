import Immutable from 'immutable';
import { handleActions } from 'redux-actions';

import * as actionTypes from './actionTypes';

const initialState = Immutable.fromJS({
  isAuthenticated: false,
  user: null
});

function compAuthSuccess(state, action) {
  const { created, user } = action.payload;
  return state.merge({
    isAuthenticated: true,
    isCreated: created,
    user
  });
}

const authReducer = handleActions({
  [actionTypes.COMPLETE_AUTH_SUCCESS]: compAuthSuccess
}, initialState);

export default authReducer;
