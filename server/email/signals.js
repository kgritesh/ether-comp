import Signal from 'signals';

const EmailEvents = {
  onAccountCreated: new Signal(),
  onAccountActivated: new Signal()
};

export default EmailEvents;
