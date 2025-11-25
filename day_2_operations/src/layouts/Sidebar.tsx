import { Dispatch } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { APPLICATION_THEME, THEME_CONSTANT } from '../constants/userConstant';
import { INITIAL_STATE_INTERFACE } from '../interfaces/interface';
import { changeLeftSidebarType } from '../store/actions/actions';
import SideBarContent from './SidebarContent';

type sidebarProps = {
    theme?: any;
    isMobile?: any;
    dispatch: Dispatch<any>;
};

const Sidebar: React.FC<sidebarProps> = (props) => {
    const { dispatch } = props;
    const theme = localStorage.getItem(APPLICATION_THEME) || '';
    useEffect(() => {
        if (document.body) {
            if (theme !== THEME_CONSTANT.LIGHT) {
                document.body.setAttribute('data-sidebar', THEME_CONSTANT.DARK);
            } else {
                document.body.setAttribute('data-sidebar', THEME_CONSTANT.LIGHT);
            }
        }
        dispatch(changeLeftSidebarType('condensed', false));
    }, [theme]);
    return (
        <div className="vertical-menu">
            <div data-simplebar className="h-100">
                <SideBarContent />
            </div>
        </div>
    );
};

const mapStateToProps = (state: INITIAL_STATE_INTERFACE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(Sidebar);
