export default class BaseConfig {
  static DEBUG = false;
  static PROJECT_ENV = process.env.NODE_ENV || 'dev';
  static isDev = () => this.PROJECT_ENV === 'dev';
}
