import Queue from 'bull';

import { EmailAccount, IncomingEmail, EmailStatus } from './models';
import { getCompService } from './index';
import config from '../config/config';
import logger from '../config/logger';
import { emailCompContract, BID_CREATED,
         BID_CANCELLED, COMP_PAID, COMP_PAYMENT_FAILED } from '../blockchain/index';

export const emailAccountQueue = new Queue('emailAccount', config.REDIS_OPTS.url);
export const emailQueue = new Queue('email', config.REDIS_OPTS.url);
export const emailBidQueue = new Queue('emailBid', config.REDIS_OPTS.url);


emailAccountQueue.process('enableCompService', async (job) => {
  const accountId = job.data.accountId;
  let account;
  try {
    account = await EmailAccount.get(accountId).run();
  } catch (error) {
    logger.error(error, `No account exists with the given id: ${accountId}`);
    return Promise.reject(
      new Error(`No account exists with the given id: ${accountId}`));
  }
  const service = getCompService(account, logger);
  return service.enableService();
});

emailAccountQueue.process('setEtherAccount', async (job) => {
  const { email, etherAccount } = job.data;
  emailCompContract.registerReceiver(email, etherAccount)
    .then(() => {
      logger.info(
        { payload: job.data },
        'Succesfully registered ether account with ether comp smart contract');
    })
    .catch(error => {
      logger.error(error, 'Failed while registering ether account with contract');
    });
});

emailAccountQueue.on('failed', (job, err) => {
  logger.error(err, {
    data: job.data,
    name: job.name
  }, `Job Failed: ${job.name}`);
});


emailQueue.process(10, async (job) => {
  const { payload } = job.data;
  const { emailAddress } = payload;
  logger.debug(payload, 'Started processing New Incoming Email');
  const account = await EmailAccount.fetchByEmail(emailAddress);
  const service = getCompService(account, logger);
  const historyId = await service.processNewEmails();
});

emailQueue.on('failed', (job, err) => {
  logger.error(err, {
    data: job.data,
  }, 'Error while processing new emails');

});

[BID_CREATED, BID_CANCELLED,
  COMP_PAID, COMP_PAYMENT_FAILED].forEach(name => {
  emailCompContract.on(name, event => {
    emailBidQueue.add(name, {
      event: JSON.stringify(event)
    });
  });
});

emailBidQueue.process(BID_CREATED, async (job) => {
  const event = JSON.parse(job.data.event);
  const { senderAddr, receiver, messageId, bid, bidOn, expiry } = event.args;
  logger.debug(event.args, 'Handle Bid Creation');
  const incomingEmail = await IncomingEmail.get(messageId)
    .getJoin({ account: true }).run();
  if (incomingEmail.account.email !== receiver) {

    logger.error({
      ...event.args,
      account: {
        provider: incomingEmail.account.provider,
        email: IncomingEmail.account.email,
        id: incomingEmail.account.id
      }
    }, 'Invalid bid created as receiver address and message '
                 + "account email doesn't match");

    return;
  }

  incomingEmail.senderAddr = senderAddr;
  incomingEmail.bid = parseInt(bid, 10);
  incomingEmail.expiry = parseInt(expiry, 10);
  IncomingEmail.bidOn = new Date(parseInt(bidOn, 10) * 1000);
  incomingEmail.status = EmailStatus.BID.name;
  await incomingEmail.save();
  logger.info({ receiver, messageId }, 'Updated status for message to bid');
  const service = getCompService(incomingEmail.account, logger);
  await service.moveEmailToComp(incomingEmail.messageId);
});

emailBidQueue.process(BID_CANCELLED, (job) => {
  const event = JSON.parse(job.data.event);
  console.log('On Bid Cancelled ', event);
});

emailBidQueue.process(COMP_PAID, (job) => {
  const event = JSON.parse(job.data.event);
  logger.info(event.args, 'Comp Paid successfully');
});

emailBidQueue.process(COMP_PAYMENT_FAILED, (job) => {
  const event = JSON.parse(job.data.event);
  logger.info(event.args, 'Comp Payment Failed');
});

emailBidQueue.on('failed', (job, err) => {
  logger.error(err, {
    data: job.data,
    name: job.name
  }, `Job Failed: ${job.name}`);
});
