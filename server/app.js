import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import jwt from 'express-jwt';
import cors from 'cors';

import logger from './config/logger';
import loggerMiddleware from './utils/loggerMiddleware';
import config from './config/config';
import apiRouter from './routes';
import { loadUser } from './auth/jwt';

const app = express();
app.use(helmet())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(loggerMiddleware(logger))
  .use(express.static('public'))
  .use(cors())
  .use(jwt({
    secret: config.SECRET_KEY,
    audience: config.JWT.audience
  }).unless({
    path: [
      /\/auth\/(?!login).*/,
      '/favicon.ico',
      /\/email\/[^/]+\/validate/,
      /\/email\/[^/]+\/callback/,
      /\/googled.+html/]
  }))
  .use(loadUser)
  .use('/', apiRouter)
  .use((req, res, next) => {
    // catch 404 and forward to error handler
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  })
  .use((err, req, res, next) => {
    const errorResp = {
      message: err.message,
    };
    if (config.PROJECT_ENV === 'dev') {
      errorResp.stacktrace = err.stack;
    }
    res.status(err.status || 500);

    res.json(errorResp);
    next(err);
  });

app.listen(config.PORT, () => {
  logger.info(`Ether Comp Server started. Listening on port: ${config.PORT}`);
});

process.on('unhandledRejection', function (reason, p) {
  logger.error(reason, 'Unhandled Promise Rejection');
});


module.exports = app;
