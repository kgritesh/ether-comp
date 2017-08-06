import path from 'path';

const env = process.env.NODE_ENV || 'dev';
const logName = 'ether-comp';

export default class BaseConfig {
  static PORT = process.env.port || 3000;

  static DB = {
    host: process.env.RETHINK_DB_HOST || 'localhost',
    port: process.env.RETHINK_DB_PORT || '28015',
    db: process.env.RETHINK_DB_NAME || 'etherComp',
    user: process.env.RETHINK_DB_USERNAME,
    password: process.env.RETHINK_DB_PASSWORD,
  };

  static LOG = {
    name: env === 'production' ? logName : `${logName}-${env}`,
    level: env === 'dev' ? 'debug' : 'info'
  };

  static SENTRY = {
    dsn: process.env.SENTRY_DSN,
    options: {
      environment: env,
      release: process.env.npm_package_version,
      sendTimeout: 5
    }
  };

  static VERSION = process.env.npm_package_version;
  static PROJECT_ROOT = path.basename(__dirname);
}
