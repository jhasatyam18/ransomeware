import React, { useEffect } from 'react';
import SideBarContent from './SideBarContent';
import { Dispatch } from 'redux';
import { changeLeftSidebarType } from '../../store/actions';
import { connect } from 'react-redux';
import { INITIAL_STATE } from '../../interfaces/interfaces';

type sidebarProps = {
    theme?: any;
    isMobile?: any;
    dispatch: Dispatch<any>;
};

const Sidebar: React.FC<sidebarProps> = (props) => {
    const { dispatch } = props;
    useEffect(() => {
        if (document.body) {
            document.body.setAttribute('data-sidebar', 'dark');
        }
        dispatch(changeLeftSidebarType('condensed', false));
    }, []);
    return (
        <div className="vertical-menu">
            <div data-simplebar className="h-100">
                <SideBarContent />
            </div>
        </div>
    );
};

const mapStateToProps = (state: INITIAL_STATE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(Sidebar);
