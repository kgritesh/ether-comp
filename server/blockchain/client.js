import Web3 from 'web3';
import SignProvider from 'ethjs-provider-signer';
import EthereumTx from 'ethereumjs-tx';
import contract from 'truffle-contract';
import pull from 'lodash/pull';

export const BID_CREATED = 'bidCreated';
export const BID_CANCELLED = 'bidCancelled';
export const COMP_PAID = 'compPaid';
export const COMP_PAYMENT_FAILED = 'compPaymentFailed';

export default class EmailCompContract {

  constructor(rpcUrl, address, privateKey, logger) {
    const provider = new SignProvider(rpcUrl, {
      signTransaction: (rawTx, cb) => {
        console.log(rawTx);
        const tx = new EthereumTx(rawTx);
        tx.sign(privateKey);
        return cb(null, tx.serialize());
      },
      accounts: (cb) => cb(null, [address])
    });
    this.account = address;
    this.web3 = new Web3(provider);
    this.contract = null;
    this.eventListeners = {
      [BID_CREATED]: [],
      [BID_CANCELLED]: [],
      [COMP_PAID]: [],
      [COMP_PAYMENT_FAILED]: []
    };

    this.logger = logger;
  }

  link(contractJson) {
    const contractDef = contract(contractJson);
    contractDef.setProvider(this.web3.currentProvider);
    return contractDef.deployed().then(inst => {
      this.contract = inst;
      this._subscribeEvents();
    });
  }

  _subscribeEvents() {
    this._subscribeEvent(this.contract.BidCreated, BID_CREATED);
    this._subscribeEvent(this.contract.BidCancelled, BID_CANCELLED);
    this._subscribeEvent(this.contract.CompPaid, COMP_PAID);
    this._subscribeEvent(this.contract.CompPaymentFailed, COMP_PAYMENT_FAILED);
  }

  _subscribeEvent(eventFunc, eventName) {
    eventFunc((error, event) => {
      if (error) {
        this.logger.error(error, `Failed to subscribe to ${eventName}`);
        return;
      }
      this._publishEvents(eventName, event);
    });
  }

  _publishEvents(name, event) {
    const listeners = this.eventListeners[name];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        this.logger.error(error, { name, event }, 'Failed while handling event');
      }
    });
  }

  getFunction(func) {
    return this.contract[func];
  }

  registerReceiver(email, accountAddr) {
    return this._funcTransaction('registerReceiver', email, accountAddr);
  }

  payBid(email, incomingEmailId) {
    return this._funcTransaction('payBid', email, incomingEmailId);
  }

  async _funcTransaction(funcName, ...args) {
    const func = this.getFunction(funcName);
    const gasEstimate = await func.estimateGas(...args, {
      from: this.account
    });
    return func(...args, {
      gas: gasEstimate + 100000,
      from: this.account
    });

  }

  on(event, listener) {
    this.eventListeners[event].push(listener);
  }

  off(event, listener) {
    pull(this.eventListeners[event], listener);
  }
}
