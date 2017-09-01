import { createAction } from 'redux-actions';

import * as actionTypes from './actionTypes';

export const showSpinner = createAction(actionTypes.SHOW_SPINNER);
export const hideSpinner = createAction(actionTypes.HIDE_SPINNER);
