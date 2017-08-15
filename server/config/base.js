import path from 'path';

const env = process.env.NODE_ENV || 'dev';
const logName = 'ether-comp';

export default class BaseConfig {
  static PORT = process.env.port || 3000;

  static DEBUG = false;

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
  static BASE_URL = 'http://127.0.0.1:3000';

  static PROVIDER = {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '659469567456-vbvpqn4ds73kusrjuhie83vtuaols2tm.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'KULx7tGEAbi2OmxSejwL_u3s',
      oauth2Scopes: [
        'https://www.googleapis.com/auth/userinfo#email',
        'https://mail.google.com/'
      ],
      oauth2RedirectUrl: 'auth/google/complete/',
      projectId: 'ether-comp',
      gmailPubSubTopic: 'projects/bitemailer-171607/topics/gmail_events'
    }
  };

  static VERSION = process.env.npm_package_version;
  static PROJECT_ROOT = path.basename(__dirname);
}
