
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import React from "react";
import store from "../../store";
import {render } from '@testing-library/react';


export default function renderWitRedux(component){
  return { ...render(<Provider store={store}>
    <BrowserRouter>
      {component}
    </BrowserRouter>
  </Provider>)}
}


