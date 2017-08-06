import bunyan from 'bunyan';
import Raven from 'raven';
import { SentryStream } from 'bunyan-sentry-stream';

import config from './config';

const streams = [
  {
    stream: process.stdout,
    level: 'debug'
  }
];

if (config.sentry.dsn) {
  const sentryClient = Raven.config(
    config.SENTRY.dsn,
    config.SENTRY.options
  ).install();

  streams.push({
    level: 'error',
    type: 'raw',
    stream: new SentryStream(sentryClient)
  });
}


const logger = bunyan.createLogger({
  name: config.LOG.name,
  level: config.LOG.level,
  streams,
  serializers: { err: bunyan.stdSerializers.err }
});

export default logger;
