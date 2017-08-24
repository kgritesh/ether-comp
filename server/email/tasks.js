import Queue from 'bull';

import { EmailAccount } from './models';
import { getCompService } from './index';
import config from '../config/config';
import logger from '../config/logger';

export const emailAccountQueue = new Queue('emailAccount', config.REDIS_OPTS.url);
export const emailQueue = new Queue('email', config.REDIS_OPTS.url);

emailAccountQueue.process('enableCompService', async (job) => {
  console.log('Started with Email Account Queue task');
  const accountId = job.data.accountId;
  let account;
  try {
    account = await EmailAccount.get(accountId).run();
  } catch (error) {
    console.error('Error', error);
    return Promise.reject(
      new Error(`No account exists with the given id: ${accountId}`));
  }
  const service = getCompService(account, logger);
  return service.enableService();
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
