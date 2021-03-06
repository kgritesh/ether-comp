export function hasOwnProperty(obj, key) {
  // https://github.com/eslint/eslint/issues/7071#issuecomment-245377924
  return {}.hasOwnProperty.call(obj, key);
}

export function copyOwnProperties(from, to, options) {
  options = Object.assign({
    exclude: []
  }, options || {});

  const keys = Object.getOwnPropertyNames(from);
  keys.forEach((k) => {
    if (options.exclude.indexOf(k) === -1 && !hasOwnProperty(to, k)) {
      Object.defineProperty(to, k, Object.getOwnPropertyDescriptor(from, k));
    }
  });
}


export function getProtoChain(cls) {
  const chain = [cls];
  let proto = Object.getPrototypeOf(cls);
  while (proto !== Function.prototype) {
    chain.push(proto);
    proto = Object.getPrototypeOf(proto);
  }
  return chain;
}

export function getEmailDomain(email) {
  const parts = email.split('@');
  return parts[parts.length - 1];
}
