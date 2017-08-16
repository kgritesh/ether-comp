import BaseConfig from './base';


export default class DevConfig extends BaseConfig {
  static DEBUG = true;
  static SECRET_KEY = 'dev secret key'
}
