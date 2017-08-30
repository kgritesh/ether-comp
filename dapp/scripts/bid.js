const Web3 = require('web3');
const artifacts = require('../build/contracts/EmailComp.json');
const contract = require('truffle-contract');

const Web3Subprovider = require('web3-provider-engine/subproviders/web3');
const ProviderEngine = require('web3-provider-engine');
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js');
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');
const VmSubprovider = require('web3-provider-engine/subproviders/vm.js');
const TransactionSubprovider = require('web3-provider-engine/subproviders/hooked-wallet-ethtx.js');
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js');
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js');

function setupProviderEngine(rpcUrl) {
  const engine = new ProviderEngine();

  // static results
  engine.addProvider(new FixtureSubprovider({
    web3_clientVersion: 'ProviderEngine/v0.0.0/javascript',
    net_listening: true,
    eth_hashrate: '0x00',
    eth_mining: false,
    eth_syncing: true,
  }));

  // cache layer
  engine.addProvider(new CacheSubprovider());

  // filters
  engine.addProvider(new FilterSubprovider());

  // pending nonce
  engine.addProvider(new NonceSubprovider());

  // vm
  engine.addProvider(new VmSubprovider());

  engine.addProvider(new TransactionSubprovider({
    getAccounts(cb) {
      console.log('Get Accounts Reached');
      return cb(null, [
        '0x0f192a3b0511740c1cfee4141e6c5f31744952bc'
      ]);
    },

    getPrivateKey(address, cb) {
      return cb(null,
                Buffer.from('93f710639c7f26df3ce016809da5ce86c1d078ebac8918857960ffd6ee9a6e35', 'hex')
      );
    }
  }));

  engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(rpcUrl)));

  // network connectivity error
  engine.on('error', function(err){
    // report connectivity errors
    console.error(err.stack)
  });

  return engine;
}

const engine = setupProviderEngine('http://127.0.0.1:8545');

const web3 = new Web3(engine);

const EmailCompContract = contract(artifacts);

const receiver = process.argv[2];
const messageId = process.argv[3];
const bid = process.argv[4];
const expiry = process.argv.length === 6 ? parseInt(process.arg[5]) : 3600 * 5;

EmailCompContract.setProvider(web3.currentProvider);

engine.start();

EmailCompContract.deployed().then((ins) => {
  console.log('Contract Deployed');
  web3.eth.getAccounts((err, accounts) => {
    console.log('Got List of accounts', accounts);
    ins.sendBid(receiver, messageId, expiry, {
      from: accounts[0],
      gas: 200000,
      value: bid
    })
      .catch(error => {
        console.error('Reaching Here', error);
        ins.cancelBid(receiver, messageId, {
          from: accounts[0]
        });
      });
    ins.BidCreated({ receiver: receiver }, (err, result) => {
      console.log('Received a bid created event', err, result);
      //ins.cancelBid(receiver, messageId, { from: accounts[0], gas: 200000 });
    });

    ins.BidCancelled({ receiver: receiver }, (err, result) => {
      console.log('Received a bid cancelled event', err, result);
    });
  });
}, (error) => console.error(error));
