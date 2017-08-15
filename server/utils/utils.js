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
