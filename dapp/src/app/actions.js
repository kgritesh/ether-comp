import { createAction } from 'redux-actions';

import * as actionTypes from './actionTypes';

export const toggleSidebar = createAction(actionTypes.TOGGLE_SIDEBAR);
