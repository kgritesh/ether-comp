require('babel-register');
const bip39 = require('bip39');
const hdkey = require('ethereumjs-wallet/hdkey');
const ProviderEngine = require('web3-provider-engine');
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet');
const Web3Subprovider = require('web3-provider-engine/subproviders/web3');
const Web3 = require('web3');

// Get our mnemonic and create an hdwallet
const mnemonic = 'accuse extend real hat they eagle worry brisk earn drop deputy guide';
const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// Get the first account using the standard hd path.
const hdWalletPath = "m/44'/60'/0'/0/";
const wallet = hdwallet.derivePath(`${hdWalletPath}0`).getWallet();
const address = `0x${wallet.getAddress().toString('hex')}`;
console.log('address', address);

const providerUrl = 'https://ropsten.infura.io/9ehOllb9H1NKBMeOP9xc';
const engine = new ProviderEngine();
engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
//engine.start(); // Required by the provider engine.
console.log('Engine Started');

module.exports = {
  networks: {
    ropsten: {
      network_id: 3,    // Official ropsten network id
      provider: engine, // Use our custom provider
      from: address,
      gas: 3000000
    },
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    }
  }
};
