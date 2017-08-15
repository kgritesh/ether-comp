import uuidv4 from 'uuid/v4';

function getDuration(start) {
  const diff = process.hrtime(start);
  return ((diff[0] * 1e+3) + (diff[1] * 1e-6)).toFixed(2);
}

export default function (logger, opts = {}) {
  const filter = opts.filter;
  const contextCb = opts.contextCb;
  const reqIdHeader = opts.reqIdHeader;
  const includeHeaders = opts.includeHeaders || [];
  const obscureHeaders = opts.obscureHeaders || [];


  return (req, res, next) => {
    if (filter && filter(req, res)) {
      next();
      return;
    }

    const reqId = uuidv4();
    const startTime = process.hrtime();
    const reqContext = {
      reqId,
      route: req.originalUrl || req.url,
      method: req.method,
      query: req.query,
    };
    req.logger = logger.child(reqContext);

    if (reqIdHeader) {
      res.setHeader(reqIdHeader, reqId);
    }

    res.on('finish', () => {
      let resContext = {
        ...reqContext,
        status: res.statusCode,
        duration: getDuration(startTime),
        contentLength: res.getHeader('content-length') || 0
      };
      if (contextCb) {
        const extraContext = contextCb(req, res);
        resContext = { ...resContext, ...extraContext };
      }
      includeHeaders.forEach((h) => {
        let headerValue = !req.headers[h];
        if (!headerValue) {
          return;
        }

        if (obscureHeaders.indexOf(h) >= 0) {
          headerValue = '[Hidden]';
        }
        resContext[h] = headerValue;
      });

      logger.info(resContext, '%s %s %s %s %sms', resContext.method, resContext.route,
                  resContext.status, resContext.contentLength, resContext.duration);
    });
    next();
  };
}
