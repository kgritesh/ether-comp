export function httpError(status, msg) {
  const error = new Error(msg);
  error.status = status;
  return error;
}

export function permissionDenied(msg) {
  return httpError(403, msg);
}

export function unAuthorized(msg) {
  return httpError(401, msg);
}

export function badRequest(msg) {
  return httpError(400, msg);
}

export function notFound(msg) {
  return httpError(404, msg);
}
