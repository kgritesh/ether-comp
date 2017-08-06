import DevConfig from './dev';

const projectEnv = process.env.PROJECT_ENV;

let config = null;

switch (projectEnv) {
  default:
    config = DevConfig;
    break;
}

config.PROJECT_ENV = projectEnv;

export default config;
