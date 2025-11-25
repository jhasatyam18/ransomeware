import React, { Suspense, useEffect } from 'react';
import { connect } from 'react-redux';
import './assets/scss/theme.scss';
import './i18n';

import { Dispatch } from 'redux';
import Loader from './components/shared/Loader';
import MessagesContainer from './components/container/MessagesContainer';
import ModalContainer from './components/container/ModalContainer';
import { INITIAL_STATE_INTERFACE, UserInterface } from './interfaces/interface';
import { APPLICATION_THEME, THEME_CONSTANT } from './constants/userConstant';
import { getValue } from './utils/apiUtils';
import { STATIC_KEYS } from './constants/StoreKey';
import { valueChange } from './store/reducers/userReducer';
const VerticalLayout = React.lazy(() => import('./layouts/index'));
const Login = React.lazy(() => import('./components/authentication/Login'));
interface AppProps {
    dispatch: Dispatch<any>;
    user: UserInterface;
    sites: any;
}
const App: React.FC<AppProps> = (props: AppProps) => {
    const { dispatch, user } = props;
    const { values, activeTab, isAuthenticated } = user;
    const isOnRestrictedPage = location.pathname.includes('/alerts') || location.pathname.includes('/replication') || location.pathname.includes('/recovery') || activeTab === 2;
    const options = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values }) || [];
    const theme = localStorage.getItem(APPLICATION_THEME) || 'dark';

    useEffect(() => {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-bs-theme', THEME_CONSTANT.LIGHT);
        } else {
            document.documentElement.setAttribute('data-bs-theme', THEME_CONSTANT.DARK);
            localStorage.setItem(APPLICATION_THEME, THEME_CONSTANT.DARK);
        }
        if (theme === 'undefined') {
            localStorage.setItem(APPLICATION_THEME, THEME_CONSTANT.DARK);
        }
    }, [theme]);

    useEffect(() => {
        if (isOnRestrictedPage && options.length > 1) {
            dispatch(valueChange([STATIC_KEYS.GLOBAL_SITE_KEY, options[1].value]));
        }
    }, [values[STATIC_KEYS.GLOBAL_OPT_SITE_DATA]]);
    return (
        <>
            <div className="app">
                <Suspense fallback={<Loader />}>{isAuthenticated ? <VerticalLayout /> : <Login user={user} dispatch={dispatch} />}</Suspense>
            </div>
            <Suspense fallback={<Loader />}>
                <MessagesContainer />
                <ModalContainer />
                <Loader />
            </Suspense>
        </>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, sites } = state;
    return {
        user,
        sites,
    };
}
export default connect(mapStateToProps)(App);
