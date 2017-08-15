import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import logger from './config/logger';
import loggerMiddleware from './utils/loggerMiddleware';
import config from './config/config';
import apiRouter from './routes';

const app = express();
app.use(helmet())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))
  .use(loggerMiddleware(logger))
  .use('/', apiRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  const errorResp = {
    message: err.message,
  };


  if (config.PROJECT_ENV === 'dev') {
    errorResp.stacktrace = err.stack;
  }
  res.status(err.status || 500);

  res.json(errorResp);
});

app.listen(config.PORT, () => {
  logger.info(`Ether Comp Server started. Listening on port: ${config.PORT}`);
});


module.exports = app;
