import React from 'react';

import Spinner from '../../utils/spinner/Spinner';
import web3Client from '../../utils/blockchain/web3Client';

export default function (Component, defaultRPCUrl) {
  return class _Web3Provider extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        loading: true
      };
    }

    componentWillMount() {
      web3Client.load(defaultRPCUrl).then(() => {
        console.log('Web3 Client Loaded', web3Client.fallbackMode);
        this.setState({ loading: false });
      }, (error) => {
        console.error('Failed while loading web3', error);
      });
    }

    render() {
      return (
        <div>
          <Spinner visible={this.state.loading} />
          {!this.state.loading ?
            <Component web3Client={web3Client} {...this.props} />
            : null}
        </div>
      );
    }
  };
}
