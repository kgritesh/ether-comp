import isString from 'lodash/isString';
import startCase from 'lodash/startCase';

import * as utils from './utils';

export const Model = db => (modelCls) => {
  const protoChain = utils.getProtoChain(modelCls);
  let schema = {};
  let options = {};

  protoChain.forEach(proto => {
    schema = { ...schema, ...(proto.schema || {}) };
    options = { ...options, ...(proto.options || {}) };
  });

  const model = db.createModel(modelCls.name, schema, options);

  // Add all indices

  (modelCls.indices || []).forEach(index => {
    if (isString(index)) {
      model.ensureIndex(index);
    } else {
      model.ensureIndex(...Object.values(index));
    }
  });

  protoChain.forEach(proto => {
    // Copy all methods to the model prototype
    utils.copyOwnProperties(proto.prototype, model.prototype, {
      exclude: ['constructor']
    });

    // Copy all class methods to the model
    utils.copyOwnProperties(proto, model, {
      exclude: ['name', 'options', 'indices', 'prototype', 'length', 'schema']
    });
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
