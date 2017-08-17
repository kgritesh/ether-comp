import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';


const rootReducers = combineReducers({
  router: routerReducer
});

export default rootReducers;
