import urljoin from 'url-join';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';

import * as utils from '../utils/utils';
import { APIRoutes } from '../constants/routes';
import config from '../config/config';
import { HttpError } from './error';


export function getAuthHeaders() {
  return {
    Authorization: 'Bearer'
  };
}

export function getJSONHeaders() {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
}


export function constructUrl(routeName, { urlParams = {}, queryParams = {} } = {}) {
  const serverUrl = config.API_SERVER_URL;
  const apiVersion = config.API_VERSION || '';
  const apiURL = APIRoutes[routeName] || routeName;
  const baseUrl = urljoin(serverUrl, apiVersion, apiURL);
  let url = baseUrl;
  Object.keys(urlParams).forEach((ident) => {
    url = url.replace(`:${ident}`, urlParams[ident]);
  });
  console.log('Url is ', url);

  if (!isEmpty(queryParams)) {
    const nonNilParams = pickBy(queryParams, v => !isNil(v));
    url += `?${utils.encodeQueryString(nonNilParams)}`;
  }
  return url;
}


function handleResponse(response, context = {}) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType.indexOf('application/json') !== -1;

  if (response.status >= 200 && response.status < 300) {
    if (isJson) {
      return response.json().then(resp => resp);
    }
    return response.text().then(resp => resp);
  }
  return response.text().then((errorResponse) => {
    let message = errorResponse;
    if (isJson) {
      context = { ...JSON.parse(errorResponse), ...context };
      message = errorResponse.error;
    }
    throw new HttpError(message, response.status, context);
  });
}

function handleRequestFailure(error, context) {
  error.context = context;
  throw error;
}

export function request(routeName, {
  method = 'GET',
  urlParams = {},
  queryParams = {},
  requireAuth = true,
  payload = undefined,
  customHeaders = {}
} = {}) {
  const url = constructUrl(routeName, { urlParams, queryParams });
  const authHeaders = requireAuth ? getAuthHeaders() : {};
  const body = JSON.stringify(payload);
  const extraHeaders = getJSONHeaders();
  const headers = Object.assign({}, authHeaders, extraHeaders, customHeaders);
  const requestData = {
    method, headers, body
  };

  return fetch(url, requestData)
    .then(response => handleResponse(response, { url, payload, method }),
          error => handleRequestFailure(error, { url, payload, method }));
}
