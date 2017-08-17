import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from '../auth/reducers';


const rootReducers = combineReducers({
  router: routerReducer,
  auth: authReducer
});

export default rootReducers;
