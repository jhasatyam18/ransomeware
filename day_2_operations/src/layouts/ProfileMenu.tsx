import { faChevronDown, faCircleArrowUp, faCircleInfo, faKey, faMoon, faPowerOff, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Dispatch } from 'redux';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../interfaces/interface';
import { APPLICATION_API_USER, APPLICATION_THEME, MODAL_ABOUT } from '../constants/userConstant';
import { API_TYPES, callAPI, createPayload, getCookie, getValue, removeCookies } from '../utils/apiUtils';
import { changePassword, logOutUser } from '../store/reducers/userReducer';
import { API_LOGOUT, system } from '../constants/ApiUrlConstant';
import { fetchByDelay } from '../utils/SlowFetch';
import { AddUserThemePreference } from '../store/actions/UserPreferenceAction';
import { openModal } from '../store/reducers/ModalReducer';

interface ProfileMenuProps extends WithTranslation {
    dispatch: Dispatch<any>;
    user: UserInterface;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ dispatch, user, t }) => {
    const [menu, setMenu] = useState(false);
    const { id, values } = user;
    const theme = getValue({ key: APPLICATION_THEME, values });
    function logout() {
        const obj = createPayload(API_TYPES.POST, {});
        callAPI(API_LOGOUT, obj).then(
            () => {
                dispatch(removeCookies());
                fetchByDelay(dispatch, logOutUser, 100);
            },
            (err) => {
                dispatch(logOutUser());
                // dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    }

    function toggle() {
        setMenu(!menu);
    }

    const renderChangePassword = () => {
        return (
            <>
                <DropdownItem onClick={() => dispatch(changePassword(true))}>
                    <FontAwesomeIcon size="lg" icon={faKey} />
                    &nbsp;&nbsp;
                    {t('change.password')}
                </DropdownItem>
                <div className="dropdown-divider" />
            </>
        );
    };

    // const aboutModal = () => {
    //     dispatch(openModal(MODAL_ABOUT, { title: 'About' }));
    // }
    const onThemeChange = () => {
        dispatch(AddUserThemePreference());
    };
    const aboutModal = () => {
        const options = { title: 'About', size: 'md', modalActions: true };
        dispatch(openModal({ content: MODAL_ABOUT, options }));
    };

    const name = getCookie(APPLICATION_API_USER) || 'Administrator';
    return (
        <>
            <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
                <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
                    <span className="d-none d-xl-inline-block ml-2 mr-1 text-capitalize">{name}</span>
                    <FontAwesomeIcon style={{ fontSize: '8px', padding: '1px' }} size="xs" icon={faChevronDown} />
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={aboutModal}>
                        <FontAwesomeIcon size="lg" icon={faCircleInfo} />
                        &nbsp;&nbsp;
                        {'About'}
                    </DropdownItem>
                    <div className="dropdown-divider" />

                    <a href={`https://${window.location.hostname}:${5000}/${system}/upgrade`} rel="noreferrer" target="_blank" className="drop-down-menu-color">
                        <DropdownItem>
                            <FontAwesomeIcon size="lg" icon={faCircleArrowUp} />
                            &nbsp;&nbsp;
                            {t('Upgrade')}
                        </DropdownItem>
                    </a>
                    <div className="dropdown-divider" />
                    <DropdownItem onClick={onThemeChange}>
                        <FontAwesomeIcon size="lg" icon={theme === 'dark' ? faSun : faMoon} />
                        &nbsp;&nbsp;
                        {'Switch Theme'}
                    </DropdownItem>

                    <div className="dropdown-divider" />
                    {id === 0 ? null : renderChangePassword()}
                    <DropdownItem onClick={logout}>
                        <FontAwesomeIcon className="text-danger" size="lg" icon={faPowerOff} />
                        &nbsp;&nbsp;
                        <span>{'logout'}</span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

const mapStateToProps = (state: INITIAL_STATE_INTERFACE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(ProfileMenu));
