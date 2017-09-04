import * as utils from '../utils/utils';

export const getEmail = state => utils.immutableToJS(state.emailComp.get('email'));

export const isValidating = state => state.emailComp.get('isValidating');
