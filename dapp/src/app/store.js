import { createStore, applyMiddleware } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { Iterable } from 'immutable';
import isPlainObject from 'lodash/isPlainObject';
import { routerMiddleware } from 'react-router-redux';

import config from '../config/config';
import rootReducer from './reducers';


function stateTransformer(state) {
  const newState = {};
  Object.keys(state).forEach(i => {
    if (Iterable.isIterable(state[i])) {
      newState[i] = state[i].toJS();
    } else if (isPlainObject(state[i])) {
      newState[i] = stateTransformer(state[i]);
    } else {
      newState[i] = state[i];
    }
  });
  return newState;
}


export default function configureStore(history) {

  const logger = createLogger({
    stateTransformer
  });

  let middlewares = [];
  if (config.isDev()) {
    middlewares.push(logger);
  }

  middlewares = [...middlewares, thunkMiddleWare, routerMiddleware(history)];

  return createStore(
    rootReducer,
    applyMiddleware(
      ...middlewares
    )
  );
}
