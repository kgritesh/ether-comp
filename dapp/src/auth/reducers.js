import Immutable from 'immutable';
import { handleActions } from 'redux-actions';

const initialState = Immutable.fromJS({
  isAuthenticated: false,
  user: null,
  isFetchingToken: false
});


const authReducer = handleActions({
}, initialState);

export default authReducer;
