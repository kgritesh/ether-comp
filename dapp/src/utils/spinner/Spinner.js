import React from 'react';
import ReactSpinner from 'react-spin';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as selectors from './selectors';

function _Spinner({ visible, config, children = null }) {
  return visible ? <ReactSpinner config={config} /> : children;
}

_Spinner.propTypes = {
  visible: PropTypes.bool.isRequired,
  config: PropTypes.object,
  children: PropTypes.object
};

_Spinner.defaultProps = {
  config: {},
  visible: false
};


const mapStateToProps = (state, ownProps) => ({
  visible: ownProps.visible ? ownProps.visible : selectors.isVisible(state, ownProps)
});

const Spinner = connect(mapStateToProps)(_Spinner);
export default Spinner;
