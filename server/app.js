import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import config from './config/config';
import apiRouter from './routes';

const app = express();
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', apiRouter);

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
  console.log(`Listening on ${config.PORT}`);
});


module.exports = app;
