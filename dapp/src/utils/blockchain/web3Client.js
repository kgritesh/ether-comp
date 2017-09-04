import Web3 from 'web3';
import ProviderEngine from 'web3-provider-engine';
import Web3Subprovider from 'web3-provider-engine/subproviders/web3';
import BaseTransactionSubprovider from 'web3-provider-engine/subproviders/hooked-wallet-ethtx';

import * as utils from '../utils';

class TransactionSubprovider {
  constructor() {
    this.account = null;
    this.privateKey = null;
    this.provider = new BaseTransactionSubprovider({
      getAccounts: this.getAccounts.bind(this),
      getPrivateKey: this.getPrivateKey.bind(this)
    });
  }

  setAccountDetails(account, privateKey) {
    this.account = account;
    this.privateKey = privateKey;
  }

  getAccounts(cb) {
    console.log('Get Accounts Called', this, this.account);
    return cb(null, [this.account]);
  }

  getPrivateKey(addr, cb) {
    return cb(null, Buffer.from(this.privateKey, 'hex'));
  }
}

const web3Client = {
  web3: null,
  fallbackMode: true,
  loader: null,
  transactionProvider: null,
  get isLoaded() {
    return this.loader !== null;
  },

  load(defaultProvideUrl) {
    this.defaultProviderUrl = defaultProvideUrl;
    if (this.isLoaded) {
      return this.loader;
    }

    this.loader = utils.onWindowLoadEventListener().then(() => {
      console.log('On Window Load');
      if (typeof web3 !== 'undefined') {
        // Customer using Metamask
        this.web3 = new Web3(window.web3.currentProvider);
        this.fallbackMode = false;
      } else {
        this._enableFallbackMode();
        // Not using metamask
      }
      window.web3 = this.web3;
      return this;
    });

    return this.loader;
  },

  _enableFallbackMode() {
    const engine = new ProviderEngine();
    this.transactionProvider = new TransactionSubprovider();
    engine.addProvider(this.transactionProvider.provider);
    engine.addProvider(new Web3Subprovider(
      new Web3.providers.HttpProvider(this.defaultProvideUrl))
    );
    engine.start();
    this.web3 = new Web3(engine);
    this.fallbackMode = true;
  },

  activateTransactionProvider(accountAddr, privateKey) {
    if (!this.isLoaded) {
      throw new Error('Client must be loaded before trying to add transaction providrr');
    }

    if (!this.fallbackMode) {
      throw new Error('No need to handle transaction signing locallly');
    }
    this.transactionProvider.setAccountDetails(accountAddr, privateKey);
  }
};

export default web3Client;

export async function getWeb3Client(providerUrl, account = null, privateKey = null) {
  await web3Client.load(providerUrl);
  if (web3Client.fallbackMode) {
    web3Client.activateTransactionProvider(account, privateKey);
  }
  return web3Client;
}
