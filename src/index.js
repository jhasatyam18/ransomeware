import React from 'react';
import { createRoot } from 'react-dom/client';
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

const container = document.getElementById('root');
const root = createRoot(container);
root.render(app);
