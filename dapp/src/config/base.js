export default class BaseConfig {
  static DEBUG = false;
  static PROJECT_ENV = process.env.NODE_ENV || 'dev';
  static isDev = () => this.PROJECT_ENV === 'dev';
  static API_SERVER_URL = 'http://127.0.0.1:3000/';
  static JWT = {
    cookie: 'jwt',
    domain: '127.0.0.1',
    expiry: 7 // days
  };

  static ETHEREUM = {
    providerUrl: 'https://rinkeby.infura.io/9ehOllb9H1NKBMeOP9xc'
  };
}
