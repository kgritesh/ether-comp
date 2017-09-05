import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Row, Col, Form, FormGroup, Label,
         Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Spinner from '../utils/spinner/Spinner';
import config from '../config/config';
import Web3Provider from '../common/components/Web3Provider';
import { CentralCard, Flex1 } from '../common/components/index';
import * as actions from './actions';
import * as selectors from './selectors';

class _EmailBidForm extends React.Component {

  static propTypes = {
    sendBid: PropTypes.func.isRequired,
    validateEmail: PropTypes.func.isRequired,
    emailDetails: PropTypes.object.isRequired,
    validationError: PropTypes.string,
    isBidProcessing: PropTypes.bool,
    bidStatus: PropTypes.object,
    match: PropTypes.object.isRequired,
    web3Client: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.closeBidStatusModal = this.closeBidStatusModal.bind(this);
    this.state = {
      values: {
        account: '',
        privateKey: '',
        bid: 0.001,
        expiry: 7
      },
      errors: {
        account: null,
        privateKey: null,
        bid: null,
        expiry: null
      },
      showBidStatusModal: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const { match } = this.props;
    console.log('Mouting Component ', this.props.match);
    this.props.validateEmail(match.params.emailId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isBidProcessing && !nextProps.isBidProcessing) {
      this.setState({ showBidStatusModal: true });
    }
  }

  closeBidStatusModal() {
    this.setState({ showBidStatusModal: false });
  }

  onSubmit(event) {
    const values = { ...this.state.values };
    const bid = {
      account: values.account,
      privateKey: values.privateKey,
      bid: {
        bid: values.bid.toString(),
        expiry: values.expiry,
        messageId: this.props.emailDetails.id,
        receiver: this.props.emailDetails.email
      }
    };
    this.props.sendBid(bid);
    event.preventDefault();
  }

  handleChange(event) {
    const id = event.target.id;
    const value = event.target.value;
    const values = { ...this.state.values };
    values[id] = value;
    this.setState({ values });
  }

  showBidStatus() {
    let title;
    let message;

    if (!this.props.bidStatus) {
      return null;
    }

    if (this.props.bidStatus.success) {
      title = 'Bid Completed';
      message =
        'Your message will now be forwarded to the recipent Inbox. In case he replies within the desired'
        + ' period, your bid will be submitted to his/her ether account.'
        + ' Otherwise bid will be cancelled and your ether will be refunded';

    } else {
      title = 'Bid Failed';
      message = 'Unable to submit bid at this time.'
        + 'Please check your account balance or contact support@ethercomp.in if problem persists';
    }
    return (
      <Modal isOpen={this.state.showBidStatusModal} toggle={this.closeBidStatusModal}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button color="default" onClick={this.closeBidStatusModal}> OK </Button>
        </ModalFooter>
      </Modal>
    );
  }

  getError() {
    return (
      <div className={`d-flex flex-column justify-content-center ${Flex1}`}>
        <Row
          className="justify-content-center"
          style={{ color: '#3b4648' }}
        >
          <Col xs={10} className="text-center">
            <h5>{this.props.validationError}</h5>
          </Col>
        </Row>
      </div>
    );
  }

  getBidForm() {
    const { values } = this.state;
    const { web3Client } = this.props;
    return (
      <div style={{ padding: 20 }}>
        {this.showBidStatus()}
        <Row
          className="justify-content-center"
          style={{ color: '#3b4648', marginBottom: 20 }}
        >
          <Col>
            <h5 className="text-center"> BID ETHER </h5>
            <div className="text-center"> Deliver your email by bidding for small amount of ether </div>
          </Col>
        </Row>
        <div style={{ padding: 20 }}>
          <Form onSubmit={this.onSubmit}>
            {web3Client.fallbackMode ?
              <div>
                <FormGroup row>
                  <Label for="account" sm={3}>Ether Account</Label>
                  <Col sm={9}>
                    <Input
                      type="input"
                      name="account"
                      id="account"
                      required
                      state="success"
                      value={values.account}
                      onChange={this.handleChange}
                      placeholder="Ether Account Number"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="privateKey" sm={3}>Private Key</Label>
                  <Col sm={9}>
                    <Input
                      type="input"
                      name="privateKey"
                      id="privateKey"
                      value={values.privateKey}
                      onChange={this.handleChange}
                      placeholder="Used at client side"
                    />
                  </Col>
                </FormGroup>
              </div>
              : null}
            <FormGroup row>
              <Label for="bid" sm={3}>Bid</Label>
              <Col sm={9}>
                <Input
                  type="number"
                  name="bid"
                  id="bid"
                  value={values.bid}
                  onChange={this.handleChange}
                  placeholder="Enter amount in Ether"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="expiry" sm={3}>Expiry</Label>
              <Col sm={9}>
                <Input
                  type="number"
                  name="expiry"
                  id="expiry"
                  value={values.expiry}
                  onChange={this.handleChange}
                  placeholder="Expiry in days"
                />
              </Col>
            </FormGroup>
            <Row className="justify-content-center" style={{ marginTop: 30 }}>
              <Col xs="10" className="align-items-center">
                <Button
                  type="submit"
                  color="primary"
                  className="text-center w-100"
                >
                  MAKE BID
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }

  render() {
    return (
      <CentralCard lg="6" sm="12">
        <Spinner id="etherComp.bidForm.loading">
          {this.props.validationError ? this.getError() : this.getBidForm()}
        </Spinner>
      </CentralCard>
    );
  }
}

const mapStateToProps = state => ({
  emailDetails: selectors.getEmail(state),
  isValidating: selectors.isValidating(state),
  validationError: selectors.getValiationError(state),
  isBidProcessing: selectors.isBidProcessing(state),
  bidStatus: selectors.getBidStatus(state)
});

const mapDispatchToProps = dispatch => ({
  validateEmail: (emailId) => dispatch(actions.validateEmail({ emailId })),
  sendBid: (bid) => dispatch(actions.sendBid(bid))
});


const EmailBidForm = Web3Provider(
  connect(mapStateToProps, mapDispatchToProps)(_EmailBidForm),
  config.ETHEREUM.providerUrl
);
export default EmailBidForm;
