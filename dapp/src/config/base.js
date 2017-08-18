export default class BaseConfig {
  static DEBUG = false;
  static PROJECT_ENV = process.env.NODE_ENV || 'dev';
  static isDev = () => this.PROJECT_ENV === 'dev';
  static API_SERVER_URL = 'http://localhost:3000/';
}
