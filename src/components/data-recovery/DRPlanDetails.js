import React, { Component, Suspense } from 'react';
import { Card, Container, CardBody, Row, Col, CardTitle, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';
import { deletePlan, fetchDRPlanById, openMigrationWizard, openRecoveryWizard, startPlan, stopPlan } from '../../store/actions/DrPlanActions';
import DMTable from '../Table/DMTable';
import { TABLE_PROTECTION_PLAN_VMS } from '../../constants/TableConstants';
import { APP_TYPE, DROP_DOWN_ACTION_TYPES, REPLICATION_STATUS } from '../../constants/InputConstants';
import DropdownActions from '../Common/DropdownActions';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import CheckBox from '../Common/CheckBox';
import DisplayString from '../Common/DisplayString';

const Replication = React.lazy(() => import('../Jobs/Replication'));
const Recovery = React.lazy(() => import('../Jobs/Recovery'));

class DRPlanDetails extends Component {
  constructor() {
    super();
    this.state = { activeTab: '1' };
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { pathname } = location;
    const parts = pathname.split('/');
    this.toggleTab = this.toggleTab.bind(this);
    dispatch(fetchDRPlanById(parts[parts.length - 1]));
  }

  toggleTab(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  renderSite(site, isRecoverySite = false) {
    if (!site || !site.platformDetails) {
      return null;
    }
    const { platformDetails } = site;
    const keys = [{ label: 'Name', field: 'platformName' }, { label: 'Platform Type', field: 'platformType' }, { label: 'Hostname', field: 'hostname' },
      { label: 'Region', field: 'region' }, { label: 'Zone', field: 'availZone' }, { label: 'Project ID', field: 'projectId' }, { label: 'Datamotive Server IP', field: 'serverIp' },
      { label: 'Datamotive Server Port', field: 'serverPort' }];
    if (!isRecoverySite) {
      keys.splice(3, 0, { label: 'Port', field: 'port' });
    }
    const fields = keys.map((ele) => {
      const { field, label } = ele;
      if (platformDetails[field]) {
        return (
          <div className="stack__info">
            <div className="label">
              {label}
            </div>
            <div className="value">
              {platformDetails[field]}
            </div>
          </div>

        );
      }
      return null;
    });
    return fields;
  }

  renderField(label, field) {
    const type = (typeof field);
    switch (type) {
      case 'boolean':
        return <CheckBox name={label} selected={field} />;
      default:
        return <DisplayString value={field} />;
    }
  }

  renderRecoveryConfig() {
    const { drPlans } = this.props;
    const { details } = drPlans;
    if (!details) {
      return null;
    }
    const keys = [{ label: 'Replication Interval', field: 'replicationInterval' }, { label: 'Subnet', field: 'subnet' }, { label: 'Encryption On Wire', field: 'isEncryptionOnWire' },
      { label: 'Encryption On Rest', field: 'isEncryptionOnRest' }, { label: 'Enable Compression', field: 'isCompression' },
      { label: 'Pre Script', field: 'preScript' }, { label: 'Post Script', field: 'postScript' }];
    const fields = keys.map((ele) => {
      const { field, label } = ele;
      if (typeof details[field] !== 'undefined') {
        return (
          <div className="stack__info">
            <div className="label">
              {label}
            </div>
            <div className="value">
              {this.renderField(label, details[field])}
            </div>
          </div>

        );
      }
      return null;
    });
    return fields;
  }

  renderStatus() {
    const { drPlans } = this.props;
    const { details } = drPlans;
    const { status, recoveryStatus } = details;
    if (recoveryStatus !== '') {
      return (
        <span className="badge badge-success">{recoveryStatus}</span>
      );
    }

    if (status === REPLICATION_STATUS.STOPPED) {
      return (
        <span className="badge badge-danger">STOPPED</span>
      );
    }
    return (
      <span className="badge badge-info">RUNNING</span>
    );
  }

  renderActions() {
    const { drPlans, dispatch, t, user } = this.props;
    const { details } = drPlans;
    const { appType } = user;
    let actions = [];
    if (appType === APP_TYPE.CLIENT) {
      actions = [{ label: 'start', action: startPlan, id: details.id, disabled: details.status !== REPLICATION_STATUS.STOPPED },
        { label: 'stop', action: stopPlan, id: details.id, disabled: details.status === REPLICATION_STATUS.STOPPED },
        { label: 'remove', action: deletePlan, id: details.id, disabled: details.status !== REPLICATION_STATUS.STOPPED, type: DROP_DOWN_ACTION_TYPES.MODAL, MODAL_COMPONENT: MODAL_CONFIRMATION_WARNING, options: { title: 'Confirmation', confirmAction: deletePlan, message: 'Are you sure want to delete  ?', id: details.id } }];
    } else {
      actions = [{ label: 'recover', action: openRecoveryWizard },
        { label: 'Migrate', action: openMigrationWizard }];
    }
    return (
      <DropdownActions title={t('actions')} dispatch={dispatch} actions={actions} />
    );
  }

  render() {
    const { drPlans, dispatch, t } = this.props;
    const { details } = drPlans;
    const { activeTab } = this.state;
    if (!details || Object.keys(details).length === 0) {
      return null;
    }
    const { name, protectedSite, recoverySite, protectedEntities, id } = details;
    const { virtualMachines } = protectedEntities;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <Row>
                <Col sm={8}>
                  <CardTitle className="mb-4 title-color">
                    {t('protection.plan')}
                    : &nbsp;&nbsp;
                    {name}
                    &nbsp;&nbsp;
                    {this.renderStatus()}
                  </CardTitle>
                </Col>
                <Col sm={4}>
                  {this.renderActions()}
                </Col>
              </Row>
              <Row>
                <Col sm={5}>
                  <CardTitle className="title-color">{t('protected.site')}</CardTitle>
                  <Card>
                    {this.renderSite(protectedSite)}
                  </Card>
                </Col>
                <Col sm={2}>
                  <div className="stack__info">
                    <div className="line" />
                  </div>
                </Col>
                <Col sm={5}>
                  <CardTitle className="title-color">{t('recovery.site')}</CardTitle>
                  {this.renderSite(recoverySite, true)}
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Nav tabs className="nav-tabs-custom nav-justified">
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                    <span className="d-none d-sm-block">{t('Virtual Machines')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
                    <span className="d-none d-sm-block">{t('recovery.configuration')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '3' })} onClick={() => { this.toggleTab('3'); }}>
                    <span className="d-none d-sm-block">{t('replication.jobs')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '4' })} onClick={() => { this.toggleTab('4'); }}>
                    <span className="d-none d-sm-block">{t('recovery.jobs')}</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className="p-3">
                  <Row>
                    <Col sm="12">
                      <DMTable
                        dispatch={dispatch}
                        columns={TABLE_PROTECTION_PLAN_VMS}
                        data={virtualMachines}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2" className="p-3">
                  <Row>
                    <Col sm="4">
                      {this.renderRecoveryConfig()}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3" className="p-3">
                  <Row>
                    <Col sm="12">
                      <Suspense fallback={<div>Loading...</div>}>
                        {activeTab === '3' ? <Replication protectionplanID={id} {...this.props} /> : null}
                      </Suspense>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4" className="p-3">
                  <Row>
                    <Col sm="12">
                      <Suspense fallback={<div>Loading...</div>}>
                        {activeTab === '4' ? <Recovery protectionplanID={id} {...this.props} /> : null}
                      </Suspense>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}
export default (withTranslation()(DRPlanDetails));
