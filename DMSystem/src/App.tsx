import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import './assets/scss/theme.scss';
import { UserInterface } from './interfaces/interfaces';
import { MESSAGE_TYPES } from './Constants/MessageConstants';
import Loader from './Components//Shared/Loader';
import GlobalContainer from './container/GlobalContainer';
import MessagesContainer from './container/MessagesContainer';
import Login from './pages/Authentication/Login';
import { addMessage } from './store/actions/MessageActions';
import ModalContainer from './container/ModalContainer';

const VerticalLayout = React.lazy(() => import('./Components/Routes/index'));

interface LayoutProps {
    isPreloader: boolean;
    layoutWidth?: any;
    leftSideBarTheme?: string;
    leftSideBarType?: string;
    showRightSidebar?: any;
    topbarTheme?: any;
    dispatch: any;
    user: UserInterface;
    location?: any;
    layout?: any;
    history?: any;
}

interface AppProps {
    dispatch: Dispatch<any>;
    user: UserInterface;
}

class App extends Component<AppProps> {
    componentDidCatch(error: Error) {
        const { dispatch } = this.props;
        dispatch(addMessage(error.toString(), MESSAGE_TYPES.ERROR));
    }

    render() {
        const { user } = this.props;
        const { isAuthenticated } = user;
        return (
            <div className="app">
                <Suspense fallback={<Loader />}>{isAuthenticated ? <VerticalLayout {...(this.props as LayoutProps)} /> : <Login {...(this.props as LayoutProps)} />}</Suspense>
                <Suspense fallback={<Loader />}>
                    <ModalContainer />
                    <MessagesContainer />
                    <GlobalContainer />
                </Suspense>
            </div>
        );
    }
}

export default connect()(App);
