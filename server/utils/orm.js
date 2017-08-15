import isString from 'lodash/isString';
import startCase from 'lodash/startCase';

import * as utils from './utils';

export const Model = db => (modelCls) => {
  const mergeParentProps = (cls, propValues) => {
    const proto = Object.getPrototypeOf(cls);
    if (proto === Function.prototype) {
      return propValues;
    }
    Object.keys(propValues).forEach((prop) => {
      propValues[prop] = { ...(proto[prop] || {}), ...propValues[prop] };
    });
    return mergeParentProps(proto, propValues);
  };
  // Create Model by combining all the fields and options
  const propValues = mergeParentProps(modelCls, {
    schema: modelCls.schema,
    options: modelCls.options
  });

  const model = db.createModel(modelCls.name, propValues.schema, propValues.options);

  // Add all indices

  (modelCls.indices || []).forEach(index => {
    if (isString(index)) {
      model.ensureIndex(index);
    } else {
      model.ensureIndex(...Object.values(index));
    }
  });

  // Copy all methods to the model prototype

  utils.copyOwnProperties(modelCls.prototype, model.prototype, {
    exclude: ['constructor']
  });

  // Copy all class methods to the model
  utils.copyOwnProperties(modelCls, model, {
    exclude: ['name', 'options', 'indices', 'prototype', 'length', 'schema']
  });

  // Set all hooks

  const hooks = {
    pre: ['save', 'delete', 'validate'],
    post: ['save', 'delete', 'validate', 'init', 'retrieve'],
  };

  Object.keys(hooks).forEach((hook) => {
    hooks[hook].forEach((event) => {
      const methodName = `${hook}${startCase(event)}`;
      if (modelCls.prototype[methodName]) {
        model[hook](event, modelCls.prototype[methodName]);
      }
    });
  });

  return model;
};
