import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from '../auth/reducers';
import spinnerReducer from '../utils/spinner/reducers';


const rootReducers = combineReducers({
  router: routerReducer,
  auth: authReducer,
  spinners: spinnerReducer
});

export default rootReducers;
