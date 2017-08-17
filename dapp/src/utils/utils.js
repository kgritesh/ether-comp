import { Iterable } from 'immutable';

export function immutableToJS(obj) {
  return Iterable.isIterable(obj) ? obj.toJS() : obj;
}
