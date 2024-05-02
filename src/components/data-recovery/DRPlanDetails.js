import classnames from 'classnames';
import React, { Component, Suspense } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { PLATFORM_TYPES, PROTECTION_PLANS_STATUS, RECOVERY_STATUS, REPLICATION_STATUS } from '../../constants/InputConstants';
import { PROTECTION_PLANS_PATH } from '../../constants/RouterConstants';
import { PLAN_DETAIL_TABS } from '../../constants/UserConstant';
import { setActiveTab } from '../../store/actions';
import { fetchCheckpointsByPlanId } from '../../store/actions/checkpointActions';
import { deletePlanConfirmation, fetchDRPlanById, onResetDiskReplicationClick, openCleanupTestRecoveryWizard, openEditProtectionPlanWizard, openMigrationWizard, openRecoveryWizard, openReverseWizard, openTestRecoveryWizard, playbookExport, startPlan, stopPlan } from '../../store/actions/DrPlanActions';
import { downloadRecoveryPlaybook } from '../../store/actions/DrPlaybooksActions';
import { convertMinutesToDaysHourFormat, getRecoveryCheckpointSummary } from '../../utils/AppUtils';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import { isPlanRecovered } from '../../utils/validationUtils';
import CheckBox from '../Common/CheckBox';
import DisplayString from '../Common/DisplayString';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DropdownActions from '../Common/DropdownActions';
import Loader from '../Shared/Loader';
import ProtectionPlanVMConfig from './ProtectionPlanVMConfig';

const Replication = React.lazy(() => import('../Jobs/Replication'));
const Recovery = React.lazy(() => import('../Jobs/Recovery'));
const RecoveryCheckPointsJobs = React.lazy(() => import('../Jobs/RecoveryCheckpointsJobs'));
const RecoveryCheckpoints = React.lazy(() => import('../Jobs/RecoveryCheckpoints'));

class DRPlanDetails extends Component {
  constructor() {
    super();
    this.disableEdit = this.disableEdit.bind(this);
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { pathname } = location;
    const parts = pathname.split('/');
    this.toggleTab = this.toggleTab.bind(this);
    const urlParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlParams.entries());
    dispatch(fetchDRPlanById(parts[parts.length - 1], params));
    dispatch(fetchCheckpointsByPlanId(parts[parts.length - 1]));
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

  toggleTab(tab) {
    const { dispatch, user } = this.props;
    const { drPlanDetailActiveTab } = user;
    const activeTab = drPlanDetailActiveTab;
    if (activeTab !== tab) {
      dispatch(setActiveTab(tab));
    }
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
    const { platformType } = platformDetails;
    const keys = [{ label: 'Name', field: name }, { label: 'Platform Type', field: platformDetails.platformType }, { label: PLATFORM_TYPES.Azure === platformType ? 'Storage Account' : 'Hostname', field: platformDetails.hostname },
      { label: 'Region', field: platformDetails.region }, { label: 'Zone', field: platformDetails.availZone }, { label: PLATFORM_TYPES.Azure === platformType ? 'Subscription ID' : 'Project ID', field: platformDetails.projectId }, { label: 'Datamotive Node IP', field: node.hostname },
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

  renderField(label, field, value, data, info) {
    if (typeof value !== 'undefined') {
      return <DisplayString value={value} data={data} info={info} />;
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
      const { field, label, value, data, info } = ele;
      if (typeof protectionPlan[field] !== 'undefined') {
        return (
          <div className="stack__info padding-right-20" key={`${field}-${index + 1}`}>
            <div className="label">
              {label}
            </div>
            <div className="value">
              {this.renderField(label, protectionPlan[field], value, data, info)}
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
    const { recoveryPointConfiguration } = protectionPlan;
    const { isRecoveryCheckpointEnabled } = recoveryPointConfiguration;
    const startTIme = protectionPlan.startTime * 1000;
    const sd = new Date(startTIme);
    const keys = [
      { label: 'Replication Interval', field: 'replicationInterval', value: `Every ${convertMinutesToDaysHourFormat(protectionPlan.replicationInterval)}` },
      { label: 'Encryption On Wire', field: 'isEncryptionOnWire' },
      { label: 'Compression', field: 'isCompression' },
      { label: 'Dedupe', field: 'isDeDupe' },
      { label: 'Differential Reverse Replication', field: 'enableDifferentialReverse' },

      { label: 'Start Time', field: 'startTime', value: `${sd.toLocaleDateString()}-${sd.toLocaleTimeString()}` },
      { label: 'Replication Pre Script', field: 'replPreScript' },
      { label: 'Replication Post Script', field: 'replPostScript' },
      { label: 'Recovery Pre Script', field: 'preScript' },
      { label: 'Recovery Post Script', field: 'postScript' },

      { label: 'Synchronize All VM Replications', field: 'enablePPlanLevelScheduling' },
      { label: 'Enable Checkpointing', field: 'recoveryPointConfiguration', value: isRecoveryCheckpointEnabled, info: () => getRecoveryCheckpointSummary(recoveryPointConfiguration) },
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
    const { drPlans, dispatch, t, user, jobs } = this.props;
    const { platformType, localVMIP } = user;
    const { protectionPlan } = drPlans;
    const { vmCheckpoint } = jobs;
    const { protectedSite, recoverySite } = protectionPlan;
    const protectedSitePlatform = protectedSite.platformDetails.platformType;
    const planHaCheckpoints = vmCheckpoint.length > 0 || false;
    const isServerActionDisabled = (protectionPlan.recoveryStatus === RECOVERY_STATUS.RECOVERED || protectionPlan.recoveryStatus === RECOVERY_STATUS.MIGRATED);
    const recoveredWithCheckpoints = planHaCheckpoints;
    const recovered = recoveredWithCheckpoints || !(protectionPlan.recoveryStatus === RECOVERY_STATUS.RECOVERED || protectionPlan.recoveryStatus === RECOVERY_STATUS.MIGRATED);
    const isReverseActionDisabled = this.disableReverse(protectionPlan);
    let actions = [];
    if (platformType === protectedSitePlatform && localVMIP !== recoverySite.node.hostname) {
      actions.push({ label: 'Start', action: startPlan, id: protectionPlan.id, disabled: this.disableStart(protectionPlan) });
      actions.push({ label: 'Stop', action: stopPlan, id: protectionPlan.id, disabled: this.disableStop(protectionPlan) });
      actions.push({ label: 'Edit', action: openEditProtectionPlanWizard, id: protectionPlan, disabled: this.disableEdit() });
      actions.push({ label: 'Resync Disk Replication', action: onResetDiskReplicationClick, id: protectionPlan, disabled: protectionPlan.status.toUpperCase() === REPLICATION_STATUS, navigate: PROTECTION_PLANS_PATH });
      actions.push({ label: 'Remove', action: deletePlanConfirmation, id: protectionPlan.id, disabled: protectionPlan.status.toUpperCase() === REPLICATION_STATUS, navigate: PROTECTION_PLANS_PATH });
      actions.push({ label: 'Download Plan Playbook', action: playbookExport, id: protectionPlan, disabled: this.disableEdit() });
    } else if (localVMIP === recoverySite.node.hostname) {
      actions = [{ label: 'recover', action: openRecoveryWizard, icon: 'fa fa-plus', disabled: !recovered || !hasRequestedPrivileges(user, ['recovery.full']) },
        { label: 'Migrate', action: openMigrationWizard, icon: 'fa fa-clone', disabled: isServerActionDisabled || !hasRequestedPrivileges(user, ['recovery.migration']) },
        { label: 'Reverse', action: openReverseWizard, icon: 'fa fa-backward', disabled: isReverseActionDisabled },
        { label: 'Test Recovery', action: openTestRecoveryWizard, icon: 'fa fa-check', disabled: isServerActionDisabled || !hasRequestedPrivileges(user, ['recovery.test']) },
        { label: 'Cleanup Test Recoveries', action: openCleanupTestRecoveryWizard, icon: 'fa fa-broom', disabled: !hasRequestedPrivileges(user, ['recovery.test']) },
        { label: 'Download Credentials Playbook', action: downloadRecoveryPlaybook, id: protectionPlan.id, icon: 'fa fa-download' },
      ];
    } else {
      // no action to add
    }
    return (
      <DropdownActions title={t('actions')} dispatch={dispatch} actions={actions} />
    );
  }

  renderRecoveryJobs() {
    const { drPlans, t, user } = this.props;
    const { localVMIP, drPlanDetailActiveTab } = user;
    const { protectionPlan } = drPlans;
    const { recoverySite } = protectionPlan;
    const activeTab = drPlanDetailActiveTab;
    if (localVMIP === recoverySite.node.hostname) {
      return (
        <NavItem>
          <NavLink className={`${classnames({ active: activeTab === '6' })} cursor-pointer`} onClick={() => { this.toggleTab('6'); }}>
            <span className="d-none d-sm-block">{t('recovery.jobs')}</span>
          </NavLink>
        </NavItem>
      );
    }
    return null;
  }

  renderRecoveryCheckpoint(isRecoveryCheckpointEnabled) {
    const { user } = this.props;
    const { drPlanDetailActiveTab } = user;
    const activeTab = drPlanDetailActiveTab;
    const { t } = this.props;
    if (!isRecoveryCheckpointEnabled) {
      return null;
    }
    return (
      <>
        <NavItem>
          <NavLink className={`${classnames({ active: activeTab === '4' })} cursor-pointer`} onClick={() => { this.toggleTab('4'); }}>
            <span className="d-none d-sm-block">{t('checkpoint.jobs')}</span>
          </NavLink>
        </NavItem>
      </>
    );
  }

  render() {
    const { drPlans, dispatch, t, user, jobs } = this.props;
    const { drPlanDetailActiveTab } = user;
    const { protectionPlan } = drPlans;
    const { vmCheckpoint } = jobs;
    const activeTab = drPlanDetailActiveTab;
    if (!protectionPlan || Object.keys(protectionPlan).length === 0) {
      return null;
    }
    const { name, protectedSite, recoverySite, id, recoveryPointConfiguration } = protectionPlan;
    const { isRecoveryCheckpointEnabled } = recoveryPointConfiguration;
    const planHasRecoveryCheckpoints = vmCheckpoint.length > 0;
    const checkpointTabs = isRecoveryCheckpointEnabled || planHasRecoveryCheckpoints;
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
                  <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.ONE })} cursor-pointer`} onClick={() => { this.toggleTab(PLAN_DETAIL_TABS.ONE); }}>
                    <span className="d-none d-sm-block">{t('Virtual Machines')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.TWO })} cursor-pointer`} onClick={() => { this.toggleTab(PLAN_DETAIL_TABS.TWO); }}>
                    <span className="d-none d-sm-block">{t('Configuration')}</span>
                  </NavLink>
                </NavItem>
                {checkpointTabs ? (
                  <NavItem>
                    <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.FIVE })} cursor-pointer`} onClick={() => { this.toggleTab(PLAN_DETAIL_TABS.FIVE); }}>
                      <span className="d-none d-sm-block">{t('point.in.time.checkpoint')}</span>
                    </NavLink>
                  </NavItem>
                ) : null}
                <NavItem>
                  <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.THREE })} cursor-pointer`} onClick={() => { this.toggleTab(PLAN_DETAIL_TABS.THREE); }}>
                    <span className="d-none d-sm-block">{t('replication.jobs')}</span>
                  </NavLink>
                </NavItem>
                {this.renderRecoveryCheckpoint(checkpointTabs)}
                {this.renderRecoveryJobs()}
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId={PLAN_DETAIL_TABS.ONE} className="p-3">
                  <ProtectionPlanVMConfig protectionPlan={protectionPlan} dispatch={dispatch} />
                </TabPane>
                <TabPane tabId={PLAN_DETAIL_TABS.TWO} className="p-3">
                  <Row>
                    <Col sm="12">
                      {this.renderRecoveryConfig()}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId={PLAN_DETAIL_TABS.THREE} className="p-3">
                  <Row>
                    <Col sm="12">
                      <Suspense fallback={<Loader />}>
                        {activeTab === PLAN_DETAIL_TABS.THREE ? <Replication protectionplanID={id} {...this.props} /> : null}
                      </Suspense>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId={PLAN_DETAIL_TABS.SIX} className="p-3">
                  <Row>
                    <Col sm="12">
                      <Suspense fallback={<Loader />}>
                        {activeTab === PLAN_DETAIL_TABS.SIX ? <Recovery protectionplanID={id} {...this.props} /> : null}
                      </Suspense>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId={PLAN_DETAIL_TABS.FOUR} className="p-3">
                  <Row>
                    <Col sm="12">
                      <Suspense fallback={<Loader />}>
                        {activeTab === PLAN_DETAIL_TABS.FOUR ? <RecoveryCheckPointsJobs user={user} protectionplanID={id} {...this.props} /> : null}
                      </Suspense>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId={PLAN_DETAIL_TABS.FIVE} className="p-3">
                  <Row>
                    <Col sm="12">
                      <Suspense fallback={<Loader />}>
                        {activeTab === PLAN_DETAIL_TABS.FIVE ? <RecoveryCheckpoints user={user} protectionplanID={id} {...this.props} /> : null}
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
