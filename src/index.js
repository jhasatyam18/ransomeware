import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './i18n';
import { Provider } from 'react-redux';

import AppContainer from './container/AppContainer';
import store from './store';

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <AppContainer />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
