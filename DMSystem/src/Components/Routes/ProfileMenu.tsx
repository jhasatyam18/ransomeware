import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { Dispatch } from 'redux';
import { INITIAL_STATE } from '../../interfaces/interfaces';
import { API_LOGOUT } from '../../Constants/apiConstants';
import { MESSAGE_TYPES } from '../../Constants/MessageConstants';
import { APPLICATION_API_USER } from '../../Constants/userConstants';
import { API_TYPES, callAPI, createPayload } from '../../utils/apiUtils';
import { getCookie } from '../../utils/cookieUtils';
import { fetchByDelay } from '../../utils/SlowFetch';
import { addMessage } from '../../store/actions/MessageActions';
import { logOutUser, removeCookies } from '../../store/actions/UserActions';

interface ProfileMenuProps extends WithTranslation {
    dispatch: Dispatch<any>;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ dispatch, t }) => {
    const [menu, setMenu] = useState(false);

    function logout() {
        const obj = createPayload(API_TYPES.POST, {});
        callAPI(API_LOGOUT, obj).then(
            () => {
                dispatch(removeCookies());
                fetchByDelay(dispatch, logOutUser, 100);
            },
            (err) => {
                dispatch(logOutUser());
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    }

    function toggle() {
        setMenu(!menu);
    }

    const name = getCookie(APPLICATION_API_USER) || '';
    return (
        <>
            <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
                <DropdownToggle className="btn header-item waves-effect" id="page-header-user-dropdown" tag="button">
                    <span className="d-none d-xl-inline-block ml-2 mr-1 text-capitalize">{name}</span>
                    <FontAwesomeIcon style={{ fontSize: '8px', padding: '1px' }} size="xs" icon={faChevronDown} />
                </DropdownToggle>
                <DropdownMenu right>
                    <Link to="#" className="dropdown-item" onClick={logout}>
                        <i className="fas fa-power-off font-size-16 align-middle mr-1 text-danger" />
                        &nbsp;&nbsp;
                        <span>{t('logout')}</span>
                    </Link>
                </DropdownMenu>
            </Dropdown>
        </>
    );
};

const mapStateToProps = (state: INITIAL_STATE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(ProfileMenu));
