import config from '../config/config';
import EmailCompContract, { BID_CREATED, BID_CANCELLED, COMP_PAID, COMP_PAYMENT_FAILED } from './client';
import emailComp from './contracts/EmailComp.json';
import logger from '../config/logger';

const etherConfig = config.ETHEREUM;
const emailCompContract = new EmailCompContract(
  etherConfig.RPC_URL, etherConfig.ACCOUNT,
  Buffer.from(etherConfig.PRIVATE_KEY, 'hex'),
  logger
);

emailCompContract.link(emailComp);

export {
  emailCompContract,
  BID_CREATED,
  BID_CANCELLED,
  COMP_PAID,
  COMP_PAYMENT_FAILED
};
