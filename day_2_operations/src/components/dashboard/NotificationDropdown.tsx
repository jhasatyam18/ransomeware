import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Badge, Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { MONITOR_ALERTS } from '../../constants/routeConstant';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { connect } from 'react-redux';
import { hideApplicationLoader } from '../../store/reducers/globalReducer';
import { AppDispatch } from '../../store';
import { callAPI, getValue } from '../../utils/apiUtils';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { addMessage } from '../../store/reducers/messageReducer';
import { addUnreadAlert } from '../../store/reducers/alertReducer';
import { API_UNREAD_ALERTS } from '../../constants/ApiUrlConstant';
import { valueChange } from '../../store/reducers/userReducer';
import { STATIC_KEYS } from '../../constants/StoreKey';

interface AlertProps extends WithTranslation {
    user: UserInterface;
    dispatch: AppDispatch;
    alerts: {
        data: Record<string, any>[];
        unread: Record<string, any>[];
    };
}

const NotificationDropdown: React.FC<AlertProps> = (props) => {
    const [menu, setMenu] = useState(false);
    const { t, dispatch, alerts, user } = props;
    const { values } = user;
    const { unread } = alerts;
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';

    useEffect(() => {
        const url = SITE_ID.length > 1 ? `${API_UNREAD_ALERTS}&siteID=${SITE_ID}` : API_UNREAD_ALERTS;
        loadAlerts(url);
        const pollAlerts = setInterval(() => loadAlerts(url), 60000);
        return () => {
            clearInterval(pollAlerts); // cleanup on unmount
        };
    }, [SITE_ID]);

    function getUnreadAlerts(url: string) {
        return (dispatch: AppDispatch) => {
            dispatch(hideApplicationLoader('Fetching_alerts'));
            return callAPI(url).then(
                (json) => {
                    if (!json) {
                        return;
                    }
                    if (json.hasError) {
                        dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                    } else {
                        const messages: string[] = [];
                        json.forEach((item: any) => {
                            if (item.warningMsg && item.warningMsg.trim() !== '') {
                                messages.push(`${item.siteName}: ${item.warningMsg}`);
                            }
                        });
                        dispatch(addUnreadAlert(json));
                        if (messages.length > 0) {
                            dispatch(addMessage({ message: messages.join('\n'), messageType: MESSAGE_TYPES.WARNING }));
                        }
                    }
                },
                (err) => {
                    dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
                },
            );
        };
    }
    function loadAlerts(url: string) {
        dispatch(getUnreadAlerts(url));
    }

    function toggleSite(siteID?: string) {
        setMenu(!menu);
        if (siteID) {
            dispatch(valueChange([STATIC_KEYS.GLOBAL_SITE_KEY, siteID]));
        }
    }

    function toggle() {
        setMenu(!menu);
    }
    const renderEmpty = () => (
        <p style={{ marginLeft: '15px' }} className="text-secondary">
            {t('no.new.notification')}
        </p>
    );

    function renderAlerts() {
        if (!unread || unread.length === 0) return renderEmpty();
        const sitesWithAlerts = unread.filter((not: any) => not.alertCount > 0);
        if (sitesWithAlerts.length === 0) return renderEmpty();

        return sitesWithAlerts.map((not: any) => {
            return (
                <Link to={MONITOR_ALERTS} onClick={() => toggleSite(not.siteID)} key={`not-alert-${not.siteID}`} className="text-reset notification-item">
                    <div className="media">
                        <div className="media-body">
                            <Row>
                                <Col sm={10}>
                                    <h6 className="mt-0 mb-1">{not.siteName}</h6>
                                </Col>
                                <Col>
                                    <h6 className="mt-0 mb-1 text-danger">{not.alertCount}</h6>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <div className="dropdown-divider" />
                </Link>
            );
        });
    }

    function renderAlertCount() {
        if (unread && unread.length > 0) {
            // Sum all unreadAlertCount values
            const totalUnread = unread.reduce((sum: number, item: any) => sum + (item.alertCount || 0), 0);
            if (totalUnread === 0) return null;
            if (totalUnread >= 99) {
                return (
                    <Badge color="danger" pill>
                        99+
                    </Badge>
                );
            }
            return (
                <Badge color="danger" pill>
                    {totalUnread}
                </Badge>
            );
        }
        return null;
    }
    return (
        <Dropdown isOpen={menu} toggle={toggle} className="dropdown d-inline-block" tag="li">
            <DropdownToggle className="btn header-item noti-icon waves-effect" tag="button" id="page-header-notifications-dropdown">
                <FontAwesomeIcon size="lg" icon={faBell} />
                <span className="m-2">{renderAlertCount()}</span>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0" right>
                <div className="p-3">
                    <Row className="align-items-center">
                        <Col>
                            <h6 className="m-0 text-white">{t('Notifications')}</h6>
                        </Col>
                    </Row>
                </div>
                <div className="dropdown-divider" />
                <SimpleBar className="max-h-230 min-h-50">{renderAlerts()}</SimpleBar>
            </DropdownMenu>
        </Dropdown>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, alerts } = state;
    return {
        user,
        alerts,
    };
}

export default connect(mapStateToProps)(withTranslation()(NotificationDropdown));
