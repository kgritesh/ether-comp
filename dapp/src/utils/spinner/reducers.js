import Immutable from 'immutable';

import * as actionTypes from './actionTypes';

function getInitialState() {
  return Immutable.fromJS({
    instances: {}
  });
}

export default function reducer(state = getInitialState(), action) {
  const instanceKey = action.payload;
  switch (action.type) {
    case actionTypes.SHOW_SPINNER:
      return state.setIn(['instances', instanceKey, 'visible'], true);
    case actionTypes.HIDE_SPINNER:
      return state.setIn(['instances', instanceKey, 'visible'], true);
    default:
      return state;
  }
}
