import Immutable from 'immutable';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from '../auth/reducers';
import spinnerReducer from '../utils/spinner/reducers';
import emailCompReducer from '../emailComp/reducers';
import * as actionTypes from './actionTypes';

function initialLayoutState() {
  return Immutable.fromJS({
    sidebarOpened: true
  });
}

function layoutReducer(state = initialLayoutState(), action) {
  if (action.type === actionTypes.TOGGLE_SIDEBAR) {
    const isSidebarOpened = state.get('sidebarOpened');
    return state.set('sidebarOpened', !isSidebarOpened);
  }
  return state;
}


const rootReducers = combineReducers({
  layout: layoutReducer,
  router: routerReducer,
  auth: authReducer,
  spinners: spinnerReducer,
  emailComp: emailCompReducer
});

export default rootReducers;
