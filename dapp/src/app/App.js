import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Switch, withRouter } from 'react-router-dom';

import AuthRoute from '../auth/AuthRoute';
import UnAuthRoute from '../auth/UnAuthRoute';
import MainAppFlow from './MainAppFlow';
import RegistrationFlow from './RegistrationFlow';
import * as actions from '../auth/actions';
import Spinner from '../utils/spinner/Spinner';

class _App extends React.Component {

  static propTypes = {
    isAuthenticating: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.login();
  }

  render() {
    return (
      <div>
        <Spinner id="auth.login" />
        { !this.props.isAuthenticating ?
          <Switch>
            <UnAuthRoute path="/auth" component={RegistrationFlow} />
            <AuthRoute path="/" component={MainAppFlow} />
          </Switch>
          : null }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticating: state.auth.get('isAuthenticating')
});

const mapDispatchToProps = (dispatch) => ({
  login: () => dispatch(actions.login())
});

const App = withRouter(connect(mapStateToProps, mapDispatchToProps)(_App));
export default App;
