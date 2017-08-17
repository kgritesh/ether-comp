import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

import { AppRoutes } from '../constants/routes';
import * as selectors from './selectors';

const loginPath = location => `${AppRoutes.login}?redirect=${location.pathname}${location.search}`;


function _AuthRoute({ isAuthenticated, component, ...rest }) {
  const Component = component;
  return (
    <Route
      {...rest}
      render={props => (
        isAuthenticated ?
          <Component {...props} />
            : <Redirect to={loginPath(props.location)} />
      )}
    />
  );

}

_AuthRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: selectors.isAuthenticated(state)
});

const AuthRoute = withRouter(connect(mapStateToProps)(_AuthRoute));
export default AuthRoute;
