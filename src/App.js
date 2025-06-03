import React, { Suspense, useEffect } from 'react';
import Login from './pages/AuthenticationInner/Login';
import MessageContainer from './container/MessageContainer';
import ModalContainer from './container/ModalContainer';
import GlobalContainer from './container/GlobalContainer';
import WizardContainer from './container/WizardContainer';
import { addMessage } from './store/actions/MessageActions';
import { MESSAGE_TYPES } from './constants/MessageConstants';
import Loader from './components/Shared/Loader';
import './assets/scss/theme.scss';
import { APPLICATION_THEME, THEME_CONSTANT } from './constants/UserConstant';

const VerticalLayout = React.lazy(() => import('./components/VerticalLayout'));

const App = (props) => {
  const { dispatch, user } = props;
  const { isAuthenticated } = user;
  const theme = localStorage.getItem(APPLICATION_THEME) || '';
  useEffect(() => {
    const handleError = (error) => {
      dispatch(addMessage(error.toString(), MESSAGE_TYPES.ERROR));
    };
    const errorHandler = (event) => {
      handleError(event.error || event.reason || new Error('Unknown error'));
    };
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);
    if (theme === 'light') {
      document.documentElement.setAttribute('data-bs-theme', THEME_CONSTANT.LIGHT);
    } else {
      document.documentElement.setAttribute('data-bs-theme', THEME_CONSTANT.DARK);
    }
    if (theme === 'undefined') {
      localStorage.setItem(APPLICATION_THEME, THEME_CONSTANT.DARK);
    }
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, [theme]);

  return (
    <div className="app">
      <Suspense fallback={<Loader />}>
        {isAuthenticated ? <VerticalLayout {...props} /> : <Login {...props} />}
      </Suspense>
      <Suspense fallback={<Loader />}>
        <MessageContainer />
        <ModalContainer />
        <WizardContainer />
        <GlobalContainer />
      </Suspense>
    </div>
  );
};

export default App;
