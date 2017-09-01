import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from './actions';
import { CentralCard } from '../common/components/index';
import Spinner from '../utils/spinner/Spinner';

class _AuthComplete extends Component {
  static propTypes = {
    user: PropTypes.object,
    isCreated: PropTypes.bool,
    location: PropTypes.object.isRequired,
    completeAuth: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const qParams = new URLSearchParams(this.props.location.search);
    this.props.completeAuth({ authCode: qParams.get('code') });
  }

  render() {
    return (
      <CentralCard>
        <div>
          <Spinner id="auth.loading" />
          {this.props.user ?
            <div className="d-flex flex-column justify-content-center h-100 align-items-center">
                Thanks for Registration
            </div> : null}
        </div>
      </CentralCard>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.get('user'),
  isCreated: state.auth.get('isCreated'),
  isAuthenticated: state.auth.get('isAuthenticated')
});


const mapDispatchToProps = dispatch => ({
  completeAuth: (provider) => dispatch(actions.completeGoogleAuth(provider))
});

const AuthComplete = connect(mapStateToProps, mapDispatchToProps)(_AuthComplete);
export default AuthComplete;
