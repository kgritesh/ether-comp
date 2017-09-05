const Web3 = require('web3');
const web3 = new Web3();
const artifacts = require('../build/contracts/EmailComp.json');
const contract = require('truffle-contract');

const receiver = process.argv[2];
const messageId = process.argv[3];
const EmailCompContract = contract(artifacts);

web3.setProvider(
  new web3.providers.HttpProvider('http://127.0.0.1:8545')
);

EmailCompContract.setProvider(web3.currentProvider);

EmailCompContract.deployed().then((ins) => {
  ins.getBid.call(receiver, messageId).then(
    (result) => console.log('result', result),
    (error) => console.error('error', error));
}, (error) => console.error(error));
