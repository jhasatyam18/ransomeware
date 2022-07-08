import classnames from 'classnames';
import React, { Component, Suspense } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { PLATFORM_TYPES, RECOVERY_STATUS, REPLICATION_STATUS, PROTECTION_PLANS_STATUS } from '../../constants/InputConstants';
import { PROTECTION_PLANS_PATH } from '../../constants/RouterConstants';
import { deletePlanConfirmation, fetchDRPlanById, openCleanupTestRecoveryWizard, openEditProtectionPlanWizard, openMigrationWizard, openRecoveryWizard, openReverseWizard, openTestRecoveryWizard, startPlan, stopPlan } from '../../store/actions/DrPlanActions';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import CheckBox from '../Common/CheckBox';
import DisplayString from '../Common/DisplayString';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DropdownActions from '../Common/DropdownActions';
import ProtectionPlanVMConfig from './ProtectionPlanVMConfig';
import { convertMinutesToDaysHourFormat } from '../../utils/AppUtils';
import { isPlanRecovered } from '../../utils/validationUtils';

const Replication = React.lazy(() => import('../Jobs/Replication'));
const Recovery = React.lazy(() => import('../Jobs/Recovery'));

class DRPlanDetails extends Component {
  constructor() {
    super();
    this.state = { activeTab: '1' };
    this.disableEdit = this.disableEdit.bind(this);
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

  disableEdit() {
    const { drPlans, user } = this.props;
    const { protectionPlan } = drPlans;
    if (!protectionPlan) {
      return true;
    }
    const { protectedSite } = protectionPlan;
    const { platformDetails } = protectedSite;
    // disable if recovery site is VMware
    if (isPlanRecovered(protectionPlan)) {
      return true;
    }
    if (platformDetails.platformType === user.platformType && hasRequestedPrivileges(user, ['protectionplan.edit'])) {
      return false;
    }
    return true;
  }

  disableStart(protectionPlan) {
    const { user } = this.props;
    return (isPlanRecovered(protectionPlan) || protectionPlan.status === REPLICATION_STATUS.INIT_FAILED || protectionPlan.status === REPLICATION_STATUS.INITIALIZING || protectionPlan.status.toUpperCase() === REPLICATION_STATUS.STARTED || !hasRequestedPrivileges(user, ['protectionplan.status']));
  }

  disableStop(protectionPlan) {
    const { user } = this.props;
    return (isPlanRecovered(protectionPlan) || protectionPlan.status === REPLICATION_STATUS.INIT_FAILED || protectionPlan.status === REPLICATION_STATUS.INITIALIZING || protectionPlan.status === REPLICATION_STATUS.STOPPED || !hasRequestedPrivileges(user, ['protectionplan.status']));
  }

  disableReverse(protectionPlan) {
    const { user } = this.props;
    const { recoverySite } = protectionPlan;
    const recoverySitePlatform = recoverySite.platformDetails.platformType;
    if (recoverySitePlatform === PLATFORM_TYPES.GCP) {
      return true;
    }
    if (!(protectionPlan.recoveryStatus === RECOVERY_STATUS.RECOVERED || protectionPlan.recoveryStatus === RECOVERY_STATUS.MIGRATED)) {
      return true;
    }
    return !hasRequestedPrivileges(user, ['recovery.reverse']);
  }

  renderSite(site) {
    if (!site || !site.platformDetails) {
      return null;
    }
    const { platformDetails, node, name } = site;

    const keys = [{ label: 'Name', field: name }, { label: 'Platform Type', field: platformDetails.platformType }, { label: 'Hostname', field: platformDetails.hostname },
      { label: 'Region', field: platformDetails.region }, { label: 'Zone', field: platformDetails.availZone }, { label: 'Project ID', field: platformDetails.projectId }, { label: 'Datamotive Node IP', field: node.hostname },
      { label: 'Datamotive Server Port', field: node.replicationDataPort }];
    const fields = keys.map((ele, index) => {
      const { field, label } = ele;
      if (field) {
        return (
          <div className="stack__info" key={`${field}-${index + 1}`}>
            <div className="label">
              {label}
            </div>
            <div className="value">
              {field}
            </div>
          </div>

        );
      }
      return null;
    });
    return fields;
  }

  renderField(label, field, value) {
    if (typeof value !== 'undefined') {
      return <DisplayString value={value} />;
    }
    const type = (typeof field);
    switch (type) {
      case 'boolean':
        return <CheckBox name={label} selected={field} />;
      default:
        return <DisplayString value={field} />;
    }
  }

  renderRecoverFields(keys) {
    const { drPlans } = this.props;
    const { protectionPlan } = drPlans;
    if (!protectionPlan) {
      return null;
    }
    const fields = keys.map((ele, index) => {
      const { field, label, value } = ele;
      if (typeof protectionPlan[field] !== 'undefined') {
        return (
          <div className="stack__info padding-right-20" key={`${field}-${index + 1}`}>
            <div className="label">
              {label}
            </div>
            <div className="value">
              {this.renderField(label, protectionPlan[field], value)}
            </div>
          </div>
        );
      }
      return null;
    });
    return fields;
  }

  renderRecoveryConfig() {
    const { drPlans } = this.props;
    const { protectionPlan } = drPlans;
    if (!protectionPlan) {
      return null;
    }
    const startTIme = protectionPlan.startTime * 1000;
    const sd = new Date(startTIme);
    const keys = [
      { label: 'Replication Interval', field: 'replicationInterval', value: `Every ${convertMinutesToDaysHourFormat(protectionPlan.replicationInterval)}` },
      { label: 'Encryption On Wire', field: 'isEncryptionOnWire' },
      { label: 'Compression', field: 'isCompression' },
      { label: 'Dedupe', field: 'isDeDupe' },
      { label: 'Differential Reverse Replication', field: 'enableReverse' },

      { label: 'Start Time', field: 'startTime', value: `${sd.toLocaleDateString()}-${sd.toLocaleTimeString()}` },
      { label: 'Replication Pre Script', field: 'replPreScript' },
      { label: 'Replication Post Script', field: 'replPostScript' },
      { label: 'Recovery Pre Script', field: 'preScript' },
      { label: 'Recovery Post Script', field: 'postScript' },

      { label: 'Script Timeout (Seconds)', field: 'scriptTimeout' },
      { label: 'Boot Delay (Seconds)', field: 'bootDelay' },
    ];
    return (
      <Row>
        <Col sm={4}>
          {this.renderRecoverFields(keys.slice(0, 5))}
        </Col>
        <Col sm={4}>
          {this.renderRecoverFields(keys.slice(5, 10))}
        </Col>
        <Col sm={4}>
          {this.renderRecoverFields(keys.slice(10, 15))}
        </Col>
      </Row>
    );
  }

  renderRecoveryStatus() {
    const { drPlans } = this.props;
    const { protectionPlan } = drPlans;
    const { recoveryStatus } = protectionPlan;
    if (recoveryStatus) {
      return (
        <span className="badge badge-success margin-right-5">{recoveryStatus.toUpperCase()}</span>
      );
    }
  }

  renderStatus() {
    const { drPlans, t } = this.props;
    const { protectionPlan } = drPlans;
    const { status } = protectionPlan;

    if (status === PROTECTION_PLANS_STATUS.STOPPED) {
      return (
        <span className="badge badge-danger">{t('status.stopped')}</span>
      );
    }
    if (status === PROTECTION_PLANS_STATUS.INIT_FAILED) {
      return (
        <span className="badge badge-danger">{t('status.init.failed')}</span>
      );
    }
    if (status === PROTECTION_PLANS_STATUS.INITIALIZING) {
      return (
        <span className="badge badge-info">{t('status.initializing')}</span>
      );
    }
    if (status === PROTECTION_PLANS_STATUS.CREATED || status === PROTECTION_PLANS_STATUS.STARTED) {
      return (
        <span className="badge badge-info">{t('status.running')}</span>
      );
    }
    return (
      <span className="badge badge-info">{t('status.running')}</span>
    );
  }

  renderActions() {
    const { drPlans, dispatch, t, user } = this.props;
    const { platformType, localVMIP } = user;
    const { protectionPlan } = drPlans;
    const { protectedSite, recoverySite } = protectionPlan;
    const protectedSitePlatform = protectedSite.platformDetails.platformType;
    const isServerActionDisabled = (protectionPlan.recoveryStatus === RECOVERY_STATUS.RECOVERED || protectionPlan.recoveryStatus === RECOVERY_STATUS.MIGRATED);
    const isReverseActionDisabled = this.disableReverse(protectionPlan);
    let actions = [];
    if (platformType === protectedSitePlatform && localVMIP !== recoverySite.node.hostname) {
      actions.push({ label: 'start', action: startPlan, id: protectionPlan.id, disabled: this.disableStart(protectionPlan) });
      actions.push({ label: 'stop', action: stopPlan, id: protectionPlan.id, disabled: this.disableStop(protectionPlan) });
      actions.push({ label: 'edit', action: openEditProtectionPlanWizard, id: protectionPlan, disabled: this.disableEdit() });
      actions.push({ label: 'remove', action: deletePlanConfirmation, id: protectionPlan.id, disabled: protectionPlan.status.toUpperCase() === REPLICATION_STATUS, navigate: PROTECTION_PLANS_PATH });
    } else if (localVMIP === recoverySite.node.hostname) {
      actions = [{ label: 'recover', action: openRecoveryWizard, icon: 'fa fa-plus', disabled: isServerActionDisabled || !hasRequestedPrivileges(user, ['recovery.full']) },
        { label: 'Migrate', action: openMigrationWizard, icon: 'fa fa-clone', disabled: isServerActionDisabled || !hasRequestedPrivileges(user, ['recovery.migration']) },
        { label: 'Reverse', action: openReverseWizard, icon: 'fa fa-backward', disabled: isReverseActionDisabled },
        { label: 'Test Recovery', action: openTestRecoveryWizard, icon: 'fa fa-check', disabled: isServerActionDisabled || !hasRequestedPrivileges(user, ['recovery.test']) },
        { label: 'Cleanup Test Recoveries', action: openCleanupTestRecoveryWizard, icon: 'fa fa-broom', disabled: !hasRequestedPrivileges(user, ['recovery.test']) }];
    } else {
      // no action to add
    }
    return (
      <DropdownActions title={t('actions')} dispatch={dispatch} actions={actions} />
    );
  }

  renderRecoveryJobs() {
    const { drPlans, t, user } = this.props;
    const { localVMIP } = user;
    const { protectionPlan } = drPlans;
    const { recoverySite } = protectionPlan;
    const { activeTab } = this.state;
    if (localVMIP === recoverySite.node.hostname) {
      return (
        <NavItem>
          <NavLink className={`${classnames({ active: activeTab === '4' })} cursor-pointer`} onClick={() => { this.toggleTab('4'); }}>
            <span className="d-none d-sm-block">{t('recovery.jobs')}</span>
          </NavLink>
        </NavItem>
      );
    }
    return null;
  }

  render() {
    const { drPlans, dispatch, t } = this.props;
    const { protectionPlan } = drPlans;
    const { activeTab } = this.state;
    if (!protectionPlan || Object.keys(protectionPlan).length === 0) {
      return null;
    }
    const { name, protectedSite, recoverySite, id } = protectionPlan;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <DMBreadCrumb links={[{ label: 'protection.plans', link: PROTECTION_PLANS_PATH }, { label: name, link: '#' }]} />
              <Row className="margin-left-5">
                <Col sm={8}>
                  <CardTitle className="mb-4 title-color">
                    {t('Status')}
                    &nbsp;&nbsp;
                    {this.renderRecoveryStatus()}
                    {this.renderStatus()}
                  </CardTitle>
                </Col>
                <Col sm={4}>
                  {this.renderActions()}
                </Col>
              </Row>
              <Row className="margin-left-5">
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
                  <NavLink className={`${classnames({ active: activeTab === '1' })} cursor-pointer`} onClick={() => { this.toggleTab('1'); }}>
                    <span className="d-none d-sm-block">{t('Virtual Machines')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={`${classnames({ active: activeTab === '2' })} cursor-pointer`} onClick={() => { this.toggleTab('2'); }}>
                    <span className="d-none d-sm-block">{t('Configuration')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={`${classnames({ active: activeTab === '2' })} cursor-pointer`} onClick={() => { this.toggleTab('3'); }}>
                    <span className="d-none d-sm-block">{t('replication.jobs')}</span>
                  </NavLink>
                </NavItem>
                {this.renderRecoveryJobs()}
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className="p-3">
                  <ProtectionPlanVMConfig protectionPlan={protectionPlan} dispatch={dispatch} />
                </TabPane>
                <TabPane tabId="2" className="p-3">
                  <Row>
                    <Col sm="12">
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
