import contract from 'truffle-contract';
import contractJson from '../contracts/EmailComp.json';

import { getWeb3Client } from '../utils/blockchain/web3Client';

const emailContract = {
  web3: null,
  loader: null,
  emailContract: null,

  get isLoaded() {
    return !!this.loader;
  },

  load(web3) {
    if (this.isLoaded) {
      return this.loader;
    }
    this.web3 = web3;
    const contractDef = contract(contractJson);
    contractDef.setProvider(this.web3.currentProvider);
    this.loader = contractDef.deployed().then(async (inst) => {
      this.emailContract = inst;
      return this;
    });
    return this.loader;
  },

  async sendBid(bid) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts(async (err, accs) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const resp = await this._funcTransaction(
            'sendBid', [bid.receiver, bid.messageId, bid.expiry], {
              value: this.web3.toWei(bid.bid),
              from: accs[0]
            });

          resolve(resp);
        } catch (error) {
          reject(error);
        }
      });
    });

  },

  getFunction(func) {
    return this.emailContract[func];
  },

  async _funcTransaction(funcName, args, opts = {}) {
    const func = this.getFunction(funcName);
    console.log('Reaching Here', func);
    const gasEstimate = await func.estimateGas(...args);
    console.log('Gas Estimate is ', gasEstimate);
    return func(...args, {
      gas: gasEstimate + 100000,
      ...opts
    });
  }
};

export default emailContract;

export async function getEmailContract(
  providerUrl, account = null, privateKey = null) {
  const web3Client = await getWeb3Client(providerUrl, account, privateKey);
  await emailContract.load(web3Client.web3);
  return emailContract;
}
