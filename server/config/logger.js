import Raven from 'raven';
import bunyan from 'bunyan';
import { SentryStream } from 'bunyan-sentry-stream';

import BunyanLogger from '../utils/bunyanLogger';
import config from './config';

const streams = [
  {
    stream: process.stdout,
    level: 'debug'
  }
];

if (config.SENTRY.dsn) {
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


const logger = new BunyanLogger({
  name: config.LOG.name,
  level: config.LOG.level,
  streams,
  serializers: { err: bunyan.stdSerializers.err }
});

export default logger;
