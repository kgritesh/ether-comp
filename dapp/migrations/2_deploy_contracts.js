const EmailComp = artifacts.require('EmailComp');

module.exports = function(deployer) {
  deployer.deploy(EmailComp);
};
