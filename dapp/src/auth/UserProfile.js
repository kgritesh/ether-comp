import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardBlock, Form, FormGroup, Label, Input, Row, Col, Button } from 'reactstrap';

import Spinner from '../utils/spinner/Spinner';
import * as actions from './actions';
import { getUser } from './selectors';
import { FlexRow, SectionHeader, Flex1 } from '../common/components/index';


class _UserProfile extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      values: {
        id: props.user.id,
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        primaryEmail: props.user.primaryEmail
      },
      errors: {
        firstName: '',
        lastName: '',
        primaryEmail: ''
      }
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onSubmit(event) {
    const values = { ...this.state.values };
    this.props.updateUser(values);
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
      <Row style={{ padding: 20 }}>
        <Col xs={8}>
          <Card className={`${Flex1}`}>
            <SectionHeader className="text-left">
              <FlexRow>
                <h5 className={`${Flex1} m-0`}>User Profile</h5>
              </FlexRow>
            </SectionHeader>
            <CardBlock className="d-flex flex-column">
              <Spinner id="app.updateUser" />
              <Row>
                <Col xs="8">
                  <Form onSubmit={this.onSubmit}>
                    <FormGroup row>
                      <Label for="firstName" sm={3}>First Name</Label>
                      <Col>
                        <Input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={values.firstName}
                          onChange={this.handleChange}
                          placeholder="First Name"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="lastName" sm={3}>Last Name</Label>
                      <Col>
                        <Input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={values.lastName}
                          onChange={this.handleChange}
                          placeholder="Last Name"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="email" sm={3}>Primary Email</Label>
                      <Col>
                        <Input
                          type="email"
                          name="primaryEmail"
                          id="primaryEmail"
                          value={values.primaryEmail}
                          onChange={this.handleChange}
                          placeholder="Primary Email"
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
            </CardBlock>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => ({
  user: getUser(state)
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (values) => dispatch(actions.updateUser(values))
});

const UserProfile = connect(mapStateToProps, mapDispatchToProps)(_UserProfile);
export default UserProfile;
