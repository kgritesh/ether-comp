import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardBlock, Form, FormGroup, Label, Input, Row, Col, Button } from 'reactstrap';

import Spinner from '../utils/spinner/Spinner';
import * as actions from './actions';
import { FlexColumn, FlexRow, SectionHeader, Flex1 } from '../common/components/index';
import { getAccounts } from '../auth/selectors';


class Account extends React.Component {

  static propTypes = {

    account: PropTypes.object.isRequired,
    setEtherAccount: PropTypes.func.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      values: {
        id: props.account.id,
        email: props.account.email,
        etherAccount: ''
      }
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onSubmit(event) {
    const values = { ...this.state.values };
    this.props.setEtherAccount(values);
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
    return (
      <Row>
        <Col xs="8">
          <Form onSubmit={this.onSubmit}>
            <Row style={{ marginBottom: '1rem' }} >
              <Label sm={3}>Email </Label>
              <Label sm={9}> {values.email} </Label>
            </Row>
            <FormGroup row>
              <Label for="etherAccount" sm={3}>Ether Account</Label>
              <Col>
                <Input
                  type="text"
                  name="etherAccount"
                  id="etherAccount"
                  value={values.etherAccount}
                  onChange={this.handleChange}
                  placeholder="Enter you Ether Account Address"
                />
              </Col>
            </FormGroup>
            <Row>
              <Col xs={3}>
                <Button
                  type="submit"
                  color="primary"
                  className="text-center"
                >
                  Update
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    );
  }

}

class _AccountList extends React.Component {
  static propTypes = {
    accountList: PropTypes.array.isRequired,
    setEtherAccount: PropTypes.func.isRequired
  }

  render() {
    const { accountList, setEtherAccount } = this.props;
    return (
      <FlexColumn style={{ padding: 20 }}>
        <Card className={`${Flex1}`}>
          <SectionHeader className="text-left">
            <FlexRow>
              <h5 className={`${Flex1} m-0`}>Accounts</h5>
            </FlexRow>
          </SectionHeader>
          <CardBlock className="d-flex flex-column" >
            <Spinner id="account.setEtherAccount" />
            {accountList.map(acc => <Account account={acc} key={acc.id} setEtherAccount={setEtherAccount} />)}
          </CardBlock>
        </Card>
      </FlexColumn>
    );
  }
}

const mapStateToProps = (state) => ({
  accountList: getAccounts(state),
});

const mapDispatchToProps = dispatch => ({
  setEtherAccount: (payload) => dispatch(actions.setEtherAccount(payload))
});

const AccountList = connect(mapStateToProps, mapDispatchToProps)(_AccountList);
export default AccountList;
