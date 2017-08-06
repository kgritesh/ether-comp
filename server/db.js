import Thinky from 'thinky';

import config from './config';
import logger from './logger';

const thinky = Thinky(config.DB);

const dbLogger = logger.child({
  host: config.DB.host,
  port: config.DB.port,
  db: config.DB.db
});

thinky.r.getPoolMaster().on('healthy', (healthy) => {
  if (healthy) {
    dbLogger.info('DB Pool connection is healthy');
  } else {
    dbLogger.error('Issue with db pool connections');
  }
});

thinky.r.getPoolMaster().on('log', dbLogger.info);

export default thinky;
