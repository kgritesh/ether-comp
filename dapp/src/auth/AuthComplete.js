import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import { connect } from 'react-redux';
import Card, { CardContent } from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

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

class _AuthComplete extends Component {
  static propTypes = {
    completeAuth: PropTypes.func.isRequired,
    isFetchingToken: PropTypes.bool.isRequired
  }

  componentWillMount() {
    this.props.completeAuth();
  }

  render() {
    const { isFetchingToken } = this.props;
    return (
      <CenterCard>
        <LogoTitle />
        <Card style={styles.card}>
          <CardContent>
            { isFetchingToken ?
              <CircularProgress /> :
              <div>
                <Typography type="body1" component="p" style={styles.textLabel}>
                 Authentication Successfull
                </Typography>
              </div>
            }
          </CardContent>
        </Card>
      </CenterCard>
    );
  }
}

const mapStateToProps = state => ({
  isFetchingToken: state.auth.get('isFetchingToken'),
  user: state.auth.get('user'),
  isCreated: state.auth.get('isCreated'),
  isAuthenticated: state.auth.get('isAuthenticated')
});


const mapDispatchToProps = dispatch => ({
  completeAuth: (provider) => dispatch(actions.initiateAuth(provider))
});

const AuthComplete = connect(null, mapDispatchToProps)(_AuthComplete);
export default AuthComplete;
