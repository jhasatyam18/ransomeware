import React, { Component, Suspense } from 'react';
import './assets/scss/theme.scss';
import PropTypes from 'prop-types';
import Login from './pages/AuthenticationInner/Login';
import MessageContainer from './container/MessageContainer';
import ModalContainer from './container/ModalContainer';
import GlobalContainer from './container/GlobalContainer';

const VerticalLayout = React.lazy(() => import('./components/VerticalLayout'));
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

class App extends Component {
  render() {
    const { user } = this.props;
    const { isAuthenticated } = user;
    return (
      <div className="app">
        <Suspense fallback={<div>Loading...</div>}>
          {isAuthenticated ? <VerticalLayout {...this.props} /> : <Login {...this.props} />}
        </Suspense>

        <MessageContainer />
        <ModalContainer />
        <GlobalContainer />
      </div>
    );
  }
}

App.propTypes = propTypes;
export default App;
