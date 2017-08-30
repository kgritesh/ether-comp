const Web3 = require('web3');
const web3 = new Web3();
const artifacts = require('../build/contracts/EmailComp.json');
const contract = require('truffle-contract')

const EmailCompContract = contract(artifacts);

web3.setProvider(
  new web3.providers.HttpProvider('http://127.0.0.1:8545')
);

EmailCompContract.setProvider(web3.currentProvider);
console.log('Email Comp Contract', EmailCompContract);

EmailCompContract.deployed().then((ins) => {
  web3.eth.getAccounts((err, accounts) => {
    console.log('Got List of accounts', accounts);
    ins.registerReceiver('ritesh@loanzen.in', accounts[1], {
      from: accounts[0]
    }).then((result) => console.log('result', result), (error) => console.error('error', error));
  }, (error) => console.error('Error while fetching accounts', error));

}, (error) => console.error(error));
