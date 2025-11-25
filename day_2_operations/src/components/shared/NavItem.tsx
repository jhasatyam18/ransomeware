import React, { useEffect } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { setActiveTab } from '../../store/reducers/userReducer';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { AppDispatch } from '../../store';

type DataType = {
    title: string;
};
type NavType = {
    data: DataType[];
    dispatch: AppDispatch;
    user: UserInterface;
};
const NavItemComp: React.FC<NavType> = ({ data, dispatch, user }) => {
    const { activeTab } = user;
    useEffect(() => {
        dispatch(setActiveTab(1));
    }, []);

    const toggleTab = (tab: number) => {
        if (activeTab !== tab) {
            dispatch(setActiveTab(tab));
        }
    };
    return (
        <>
            <Nav tabs className="nav-tabs-custom nav-justified w-25 mb-2">
                {data.map((el: DataType, i: number) => (
                    <NavItem key={`${el.title}-${i}`}>
                        <NavLink className={`${activeTab === i + 1 ? 'active' : ''}`} onClick={() => toggleTab(i + 1)}>
                            <span className="d-none d-sm-block">{el.title}</span>
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
        </>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user } = state;
    return {
        user,
    };
}

export default connect(mapStateToProps)(withTranslation()(NavItemComp));
