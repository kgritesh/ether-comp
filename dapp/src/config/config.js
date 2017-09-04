import DevConfig from './dev';

const projectEnv = process.env.PROJECT_ENV || 'dev';

let config = null;

switch (projectEnv) {
  case 'dev':
  default:
    config = DevConfig;
    break;
}

config.PROJECT_ENV = projectEnv;

export default config;
