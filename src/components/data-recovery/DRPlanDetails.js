import React, { Component, Suspense } from 'react';
import { Card, Container, CardBody, Row, Col, CardTitle, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';
import { deletePlan, fetchDRPlanById, fetchDrPlans, startPlan, stopPlan } from '../../store/actions/DrPlanActions';
import DMTable from '../Table/DMTable';
import { TABLE_PROTECT_VM_VMWARE } from '../../constants/TableConstants';
import { APP_TYPE, DROP_DOWN_ACTION_TYPES, REPLICATION_STATUS } from '../../constants/InputConstants';
import DropdownActions from '../Common/DropdownActions';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { MIGRAION_WIZARDS, RECOVERY_WIZARDS } from '../../constants/WizardConstants';

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

  renderSite(site) {
    if (!site || !site.platformDetails) {
      return null;
    }
    const { platformDetails } = site;
    const keys = [{ label: 'Name', field: 'platformName' }, { label: 'Platform Type', field: 'platformType' }, { label: 'Hostname', field: 'hostname' }, { label: 'Port', field: 'port' },
      { label: 'Region', field: 'region' }, { label: 'Zone', field: 'availZone' }, { label: 'Projec  t ID', field: 'projectId' }, { label: 'Datamotive Server IP', field: 'serverIp' },
      { label: 'Datamotive Server Port', field: 'serverPort' }, { label: 'Machine IP', field: 'prepMachineIP' }];
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

  renderRecoveryConfig(config) {
    if (!config || !config.instanceDetails) {
      return null;
    }
    const { instanceDetails } = config;
    const keys = [{ label: 'AMIID', field: 'amiID' }, { label: 'Instance Type', field: 'instanceType' }, { label: 'Availability Zone', field: 'availabilityZone' }, { label: 'Volume Type', field: 'volumeType' }];
    const fields = keys.map((ele) => {
      const { field, label } = ele;
      if (instanceDetails[field]) {
        return (
          <div className="stack__info">
            <div className="label">
              {label}
            </div>
            <div className="value">
              {instanceDetails[field]}
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
    const { status } = details;
    if (status === REPLICATION_STATUS.STOPPED) {
      return (
        <span className="badge badge-danger">STOPPED</span>
      );
    }
    return (
      <span className="badge badge-success">RUNNING</span>
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
        { label: 'remove', action: deletePlan, id: details.id, disabled: details.status !== REPLICATION_STATUS.STOPPED, type: DROP_DOWN_ACTION_TYPES.MODAL, MODAL_COMPONENT: MODAL_CONFIRMATION_WARNING, options: { title: 'Alert', confirmAction: deletePlan, message: 'Are you sure want to delete  ?', id: details.id } }];
    } else {
      actions = [{ label: 'recover', type: DROP_DOWN_ACTION_TYPES.WIZARD, wizard: RECOVERY_WIZARDS, init: fetchDrPlans, initValue: 'ui.values.drplan' },
        { label: 'Migrate', type: DROP_DOWN_ACTION_TYPES.WIZARD, wizard: MIGRAION_WIZARDS, init: fetchDrPlans, initValue: 'ui.values.drplan' }];
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
    const { name, protectedSite, recoverySite, protectedEntities, recoveryEntities, id } = details;
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
                  {this.renderSite(recoverySite)}
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Nav tabs className="nav-tabs-custom nav-justified">
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                    <span className="d-none d-sm-block">{t('protected.virtual.machines')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
                    <span className="d-none d-sm-block">{t('recovery.configuration')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '3' })} onClick={() => { this.toggleTab('3'); }}>
                    <span className="d-none d-sm-block">{t('replications')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '4' })} onClick={() => { this.toggleTab('4'); }}>
                    <span className="d-none d-sm-block">{t('recovery')}</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className="p-3">
                  <Row>
                    <Col sm="12">
                      <DMTable
                        dispatch={dispatch}
                        columns={TABLE_PROTECT_VM_VMWARE}
                        data={virtualMachines}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2" className="p-3">
                  <Row>
                    <Col sm="4">
                      {this.renderRecoveryConfig(recoveryEntities)}
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
