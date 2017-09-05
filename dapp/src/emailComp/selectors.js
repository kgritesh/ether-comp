import * as utils from '../utils/utils';

export const getEmail = state => utils.immutableToJS(state.emailComp.get('email'));

export const isValidating = state => state.emailComp.get('isValidating');

export const getValiationError = state => state.emailComp.get('validationError');

export const isBidProcessing = state => state.emailComp.get('isBidProcessing');

export const getBidStatus = state => utils.immutableToJS(state.emailComp.get('bidStatus'));
