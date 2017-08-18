import { Iterable } from 'immutable';
import isArray from 'lodash/isArray';
import transform from 'lodash/transform';


export function encodeQueryString(obj) {
  const encode = encodeURIComponent;
  const reducer = (result, value, key) => {
    if (isArray(value)) {
      value.forEach((item) => {
        result.push(`${encode(key)}=${encode(item)}`);
      });
    } else {
      result.push(`${encode(key)}=${encode(value)}`);
    }
  };
  const frags = transform(obj, reducer, []);
  return frags.join('&');
}

export function immutableToJS(obj) {
  return Iterable.isIterable(obj) ? obj.toJS() : obj;
}
