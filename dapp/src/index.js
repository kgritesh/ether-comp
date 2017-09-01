import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import 'bootstrap/dist/css/bootstrap.css';

import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './app/store';

const history = createHistory();
const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>, document.getElementById('root')
);
registerServiceWorker();
