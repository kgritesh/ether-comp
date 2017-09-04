import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';

import Spinner from '../utils/spinner/Spinner';
import config from '../config/config';
import Web3Provider from '../common/components/Web3Provider';
import { CentralCard } from '../common/components/index';
import * as actions from './actions';
import * as selectors from './selectors';

class _EmailBidForm extends React.Component {

  static propTypes = {
    sendBid: PropTypes.func.isRequired,
    validateEmail: PropTypes.func.isRequired,
    emailDetails: PropTypes.object.isRequired,
    isValidating: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    web3Client: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
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
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const { match } = this.props;
    console.log('Mouting Component ', this.props.match);
    this.props.validateEmail(match.params.emailId);
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

  render() {
    const { values } = this.state;
    const { web3Client } = this.props;
    return (
      <CentralCard lg="6" sm="12">
        <Spinner id="etherComp.bid.loading" />
        <div style={{ padding: 20 }}>
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
      </CentralCard>
    );
  }
}

const mapStateToProps = state => ({
  emailDetails: selectors.getEmail(state),
  isValidating: selectors.isValidating(state)
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
