import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Div } from 'glamorous';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';

import * as actions from './actions';
import { CenterCard, LogoTitle } from '../common/components/index';

const styles = {
  logo: {
    color: 'white'
  },
  card: {
    width: 300,
    minHeight: 200,
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  textLabel: {
    color: 'rgba(0, 0, 0, 0.7)'
  }
};

class _Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired
  }

  render() {
    return (
      <CenterCard>
        <LogoTitle />
        <Card style={styles.card}>
          <CardContent>
            <Typography type="body1" component="p" style={styles.textLabel}>
              Register/Login with your email account
            </Typography>
            <Div display="flex" flexDirection="column" flex="1" marginTop="10">
              <Button raised color="primary" onClick={() => this.props.login('google')}>
                Login with Google
              </Button>
            </Div>
          </CardContent>
        </Card>
      </CenterCard>
    );
  }
}


const mapDispatchToProps = dispatch => ({
  login: (provider) => dispatch(actions.initiateAuth(provider))
});

const Login = connect(null, mapDispatchToProps)(_Login);
export default Login;
