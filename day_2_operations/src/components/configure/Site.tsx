import React, { useEffect, useState } from 'react';
import { ALERT_FILTERS, GLOBAL_ALERTS, SITE_TABLE } from '../../constant/tableConstant';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import NavItem from '../shared/NavItem';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMBreadCrumb from '../shared/DMBreadCrumb';
import { API_SITE_ALERTS, API_SITES } from '../../constants/ApiUrlConstant';
import { ActionButton } from '@dm/common-comp';
import { openModal } from '../../store/reducers/ModalReducer';
import { MODAL_REGISTER_SITE } from '../../constants/siteConnection';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/userConstant';
import { deleteSites, handleSiteTableSelection, selectAllSites } from '../../store/actions/siteAction';
import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { clearValues, valueChange } from '../../store/reducers/userReducer';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { getValue, hasPriviledges } from '../../utils/apiUtils';
import { STATIC_KEYS } from '../../constants/StoreKey';
import DMPaginatorTableWrapper from '../shared/DMPaginatorTableWrapper';
import { AppDispatch } from '../../store';
import { addSiteData } from '../../store/reducers/siteReducers';
import useEnforceNonGlobal from '../dashboard/EnforceNonGlobal';
type SiteType = {
    dispatch: AppDispatch;
    user: UserInterface;
    sites: any;
};
const Site: React.FC<SiteType> = ({ dispatch, user, sites = { sites: [], selectedSites: {} } }) => {
    const [apiUrl, setApiUrl] = React.useState<string>('');
    const { selectedSites = [] } = sites;
    const { activeTab, values } = user;
    const disable = Object.keys(selectedSites).length === 0 || Object.keys(selectedSites).length > 1;
    const tabOptions = [{ title: 'Summary' }, { title: 'Alerts' }];
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const [apiUrlReport, setApiUrlReport] = useState<string>('');
    const OPTIONS = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values }) || [];
    let priviledges = hasPriviledges();
    useEnforceNonGlobal(SITE_ID, OPTIONS, dispatch, activeTab === 2);
    useEffect(() => {
        const updatedUrl = SITE_ID.length > 1 ? `${API_SITES}?siteID=${SITE_ID}` : `${API_SITES}?`;
        setApiUrl(updatedUrl);
        if (SITE_ID && SITE_ID !== '1') {
            const updatedAlertUrl = `${API_SITE_ALERTS}siteID=${SITE_ID}`;
            setApiUrlReport(updatedAlertUrl);
        }
    }, [SITE_ID]);

    const onRegisterSiteClick = () => {
        dispatch(clearValues());
        const options = { title: 'Register New Site', size: 'md', modalActions: true };
        dispatch(openModal({ content: MODAL_REGISTER_SITE, options }));
    };

    const deleteSelectedSites = () => {
        const sites = Object.values(selectedSites).map((item: any) => item.name);
        const options = { title: 'Alert', confirmAction: deleteSites, message: `Are you sure you want to deregister ${sites.join(', ')} ?` };
        dispatch(openModal({ content: MODAL_CONFIRMATION_WARNING, options }));
    };

    const onReconfigureSite = () => {
        const siteKey = Object.keys(selectedSites)[0];
        const keys = ['configureSite.name', 'configureSite.hostName', 'configureSite.userName', 'configureSite.password'];
        keys.map((key: string) => {
            const parts = key.split('.');
            dispatch(valueChange([key, selectedSites[siteKey][parts[1]]]));
        });
        const options = { isEdit: true, id: selectedSites[siteKey].id, title: 'Reconfigure Site ' };
        dispatch(openModal({ content: MODAL_REGISTER_SITE, options }));
    };

    return (
        <Container fluid>
            <Card>
                <CardBody>
                    <DMBreadCrumb links={[{ label: 'Sites', link: '#' }]} />
                    <div className="ml-4 mr-4">
                        <NavItem data={tabOptions} />
                        <Row className="mt-3">
                            <Col sm={6}>
                                {' '}
                                {activeTab === 1 ? (
                                    <div className="btn-toolbar h-100 pb-2">
                                        <div className="btn-group" role="group" aria-label="First group">
                                            <ActionButton label="Register" onClick={onRegisterSiteClick} icon={faPlus} isDisabled={!priviledges} />
                                            <ActionButton label="Reconfigure" onClick={onReconfigureSite} icon={faEdit} isDisabled={disable || !priviledges} />
                                            <ActionButton label="Deregister" onClick={deleteSelectedSites} icon={faTrash} isDisabled={disable || !priviledges} />
                                        </div>
                                    </div>
                                ) : null}
                            </Col>
                        </Row>
                        {activeTab === 1 && apiUrl !== '' ? <DMPaginatorTableWrapper storeFn={addSiteData} user={user} dispatch={dispatch} isSelectable={true} showFilter="true" apiUrl={apiUrl} columns={SITE_TABLE} onSelect={handleSiteTableSelection} onSelectAll={selectAllSites} selectedRows={selectedSites} /> : null}
                        {activeTab === 2 ? <DMPaginatorTableWrapper subFilterTitle="Status" subFilter={ALERT_FILTERS} user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="SITES_ALERT" apiUrl={apiUrlReport} columns={GLOBAL_ALERTS} /> : null}
                    </div>
                </CardBody>
            </Card>
        </Container>
    );
};

// export default Node;
function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, sites } = state;
    return {
        user,
        sites,
    };
}

export default connect(mapStateToProps)(withTranslation()(Site));
