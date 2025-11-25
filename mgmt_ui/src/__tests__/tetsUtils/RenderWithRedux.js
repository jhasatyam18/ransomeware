import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import React from 'react';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import store from '../../store';
import i18n from '../../i18n';

export default function renderWitRedux(component) {
  return { ...render(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </I18nextProvider>
    </Provider>,
  ) };
}
