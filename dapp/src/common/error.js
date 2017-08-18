export class HttpError extends Error {
  constructor(message, code, context = {}) {
    super(message);
     // Capturing stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
  }
}
