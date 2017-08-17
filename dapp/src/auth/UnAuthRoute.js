import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

import { AppRoutes } from '../constants/routes';
import * as selectors from './selectors';

function _UnAuthRoute({ isAuthenticated, component, ...rest }) {
  const Component = component;
  return (
    <Route
      {...rest}
      render={props => (
        !isAuthenticated ?
          <Component {...props} />
            : <Redirect to={AppRoutes.home} />
      )}
    />
  );

}

_UnAuthRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: selectors.isAuthenticated(state)
});

const UnAuthRoute = withRouter(connect(mapStateToProps)(_UnAuthRoute));
export default UnAuthRoute;
