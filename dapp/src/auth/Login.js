import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Row, Col } from 'reactstrap';

import { CentralCard } from '../common/components/index';
import * as actions from './actions';


const styles = {
  logo: {
    color: 'white'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  card: {
    minHeight: 300,
    display: 'flex',
    flex: 1
  },

  signupText: {
    margin: '20px',
    color: '#3B4648'
  }
};

function _Login({ login }) {
  return (
    <CentralCard>
      <div>
        <Row
          className="justify-content-center m-10"
          style={styles.signupText}
        >
          <Col xs="8">
            <div className="text-center"> SIGNUP / LOGIN WITH </div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs="10" className="align-items-center">
            <Button
              color="primary"
              className="text-center w-100"
              onClick={() => login('google')}
            >
              GOOGLE
            </Button>
          </Col>
        </Row>
      </div>
    </CentralCard>
  );
}

_Login.propTypes = {
  login: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  login: (provider) => dispatch(actions.initiateAuth(provider))
});

const Login = connect(null, mapDispatchToProps)(_Login);
export default Login;
