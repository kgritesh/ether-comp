const Web3 = require('web3');
// const artifacts = require('../build/contracts/EmailComp.json');
// const contract = require('truffle-contract');

// const Web3Subprovider = require('web3-provider-engine/subproviders/web3');
// const ProviderEngine = require('web3-provider-engine');
// const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js');
// const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');
// const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');
// const VmSubprovider = require('web3-provider-engine/subproviders/vm.js');
// const TransactionSubprovider = require('web3-provider-engine/subproviders/hooked-wallet-ethtx.js');
// const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js');
// const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js');


// const accounts = {
//   '0xaa852a8fd6b8348139948d5c43849cd4cc501a74': '02dbf162ef8db3620639817b63faada80077cdda4caa87579034f0f602753caf',
//   '0x831f808bf0dae78cbbd63c0968c97e0ca90c9037': '63a84ea832c07b5a14e9cd62635cc1de2e87aeeb099663b5d5be81780da91a06',
//   '0x0f192a3b0511740c1cfee4141e6c5f31744952bc': '93f710639c7f26df3ce016809da5ce86c1d078ebac8918857960ffd6ee9a6e35'
// };

// function setupProviderEngine(rpcUrl) {
//   const engine = new ProviderEngine();

//   // static results
//   engine.addProvider(new FixtureSubprovider({
//     web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
//     net_listening: true,
//     eth_hashrate: '0x00',
//     eth_mining: false,
//     eth_syncing: true,
//   }));

//   // cache layer
//   engine.addProvider(new CacheSubprovider());

//   // filters
//   engine.addProvider(new FilterSubprovider());

//   // pending nonce
//   engine.addProvider(new NonceSubprovider());

//   // vm
//   engine.addProvider(new VmSubprovider());

//   engine.addProvider(new TransactionSubprovider({
//     getAccounts(cb) {

//       return cb(null, Object.keys(accounts));
//     },

//     getPrivateKey(address, cb) {
//       const privateKey = accounts[address];
//       return cb(null, Buffer.from(privateKey, 'hex'));
//     }
//   }));

//   engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(rpcUrl)));

//   // network connectivity error
//   engine.on('error', function(err){
//     // report connectivity errors
//     console.error(err.stack)
//   });

//   return engine;
// }

// const engine = setupProviderEngine('http://127.0.0.1:8545');

// const web3 = new Web3(engine);

// const EmailCompContract = contract(artifacts);

// EmailCompContract.setProvider(web3.currentProvider);

// engine.start();

// EmailCompContract.deployed().then((ins) => {
//   console.log('Contract Deployed');
//   web3.eth.getAccounts((err, accs) => {
//     console.log('Accounts Here', accs);
//     if (!accs) {
//       return;
//     }
//     accs.forEach((acc) => {
//       console.log('Balance', acc, web3.eth.getBalance(acc));
//     });
//   });
// });

const web3 = new Web3();
web3.setProvider(
  new web3.providers.HttpProvider('http://127.0.0.1:8545')
);
web3.eth.getAccounts((err, accounts) => {
  console.log('Got List of accounts', accounts);
  for (let i = 0; i < accounts.length; i++) {
    const acc = accounts[i];
    console.log('Checking for ', acc);
    console.log('Balance', acc, web3.eth.getBalance(acc).toNumber()/ 100000000000000000000);
  }
});
