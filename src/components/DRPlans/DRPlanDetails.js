import { faBackward, faBroom, faCheck, faCheckDouble, faClone, faDesktop, faDownload, faEdit, faPlay, faPlus, faRetweet, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React, { Component, Suspense } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import SimpleBar from 'simplebar-react';
import { Badge, Card, CardBody, CardTitle, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { PLATFORM_TYPES, PROTECTION_PLANS_STATUS, RECOVERY_STATUS, REPLICATION_JOB_TYPE, REPLICATION_STATUS } from '../../constants/InputConstants';
import { PROTECTION_PLAN_CLEANUP_PATH, PROTECTION_PLANS_PATH, PROTECTION_PLAN_FLOW } from '../../constants/RouterConstants';
import DMToolTip from '../Shared/DMToolTip';
import { PLAN_DETAIL_TABS } from '../../constants/UserConstant';
import { setActiveTab } from '../../store/actions';
import { fetchCheckpointsByPlanId, setCheckpointCount, setVmlevelCheckpoints } from '../../store/actions/checkpointActions';
import { drPlanDetailsFetched, drPlanStatus, fetchDRPlanById, onDeleteProtectionPlanClick, onResetDiskReplicationClick, openEditProtectionPlanWizard, openMigrationWizard, openRecoveryWizard, openReverseWizard, openTestRecoveryWizard, planDetailSummaryData, playbookExport } from '../../store/actions/DrPlanActions';
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
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { closeModal, openModal } from '../../store/actions/ModalActions';
import Spinner from '../Common/Spinner';
import { changeReplicationJobType } from '../../store/actions/JobActions';

const Replication = React.lazy(() => import('../Jobs/Replication'));
const Recovery = React.lazy(() => import('../Jobs/Recovery'));
const RecoveryCheckPointsJobs = React.lazy(() => import('../Jobs/RecoveryCheckpointsJobs'));
const RecoveryCheckpoints = React.lazy(() => import('../Jobs/RecoveryCheckpoints'));

class DRPlanDetails extends Component {
  constructor() {
    super();
    this.disableEdit = this.disableEdit.bind(this);
    this.showTestRecoveredVmModal = this.showTestRecoveredVmModal.bind(this);
    this.showTestRecoveredVm = this.showTestRecoveredVm.bind(this);
    this.footer = this.footer.bind(this);
  }

  componentDidMount() {
    const { dispatch, location, user } = this.props;
    const { pathname } = location;
    const parts = pathname.split('/');
    const { drPlanDetailActiveTab } = user;
    this.toggleTab = this.toggleTab.bind(this);
    dispatch(fetchDRPlanById(parts[parts.length - 1]));
    dispatch(fetchCheckpointsByPlanId(parts[parts.length - 1]));
    dispatch(setActiveTab(drPlanDetailActiveTab || '1'));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setVmlevelCheckpoints([]));
    dispatch(setCheckpointCount(0));
    dispatch(setActiveTab('1'));
    dispatch(changeReplicationJobType(REPLICATION_JOB_TYPE.PLAN));
    dispatch(drPlanDetailsFetched({}));
  }

  stopPlanClick = () => () => {
    const { drPlans, history } = this.props;
    const { protectionPlan } = drPlans;
    history.push(`${PROTECTION_PLAN_FLOW.replace(':id', protectionPlan.id).replace(':flow', 'stop')}`);
  };

  startPlanCLick = () => () => {
    const { drPlans, history } = this.props;
    const { protectionPlan } = drPlans;
    history.push(`${PROTECTION_PLAN_FLOW.replace(':id', protectionPlan.id).replace(':flow', 'start')}`);
  };

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
    const newStatus = drPlanStatus(protectionPlan);
    return (isPlanRecovered(protectionPlan) || newStatus === REPLICATION_STATUS.INIT_FAILED || newStatus === REPLICATION_STATUS.INITIALIZING || !hasRequestedPrivileges(user, ['protectionplan.status']));
  }

  disableStop(protectionPlan) {
    const { user } = this.props;
    return (isPlanRecovered(protectionPlan) || protectionPlan.status === REPLICATION_STATUS.INIT_FAILED || protectionPlan.status === REPLICATION_STATUS.INITIALIZING || !hasRequestedPrivileges(user, ['protectionplan.status']));
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

  showTestRecoveredVm() {
    const { drPlans } = this.props;
    const { testRecoveryInMonth } = drPlans;
    const { tested, notTested } = testRecoveryInMonth;
    return (
      <>
        <SimpleBar style={{ maxHeight: '40vh', minHeight: '10vh', color: 'white', textAlign: 'center' }}>
          <Row>
            <Col sm={1} />
            <Col sm={5} style={{ borderRight: '1px solid #32394e' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '2px' }}>Test Recovered</p>
              <hr style={{ margin: '4px' }} />
              {tested?.map((el) => <p key={`${el}-tested`} style={{ marginBottom: '2px' }}>{el}</p>)}
            </Col>
            <Col sm={1} />
            <Col sm={5}>
              <p style={{ fontWeight: 'bold', marginBottom: '2px' }}>Not Tested</p>
              <hr style={{ margin: '4px' }} />
              {notTested?.map((el) => <p key={`${el}-tested`} style={{ marginBottom: '2px' }}>{el}</p>)}
            </Col>
          </Row>
        </SimpleBar>
      </>
    );
  }

  footer() {
    const { t, dispatch } = this.props;
    return (
      <>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => dispatch(closeModal())}>
            {t('close')}
          </button>
        </div>
      </>
    );
  }

  showTestRecoveredVmModal() {
    const { dispatch } = this.props;
    const options = { title: 'Test Recovered Virtual Machines', footerComponent: this.footer, node: null, isUpdate: false, component: this.showTestRecoveredVm, size: 'lg' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
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
      { label: 'Point In Time', field: 'recoveryPointConfiguration', value: isRecoveryCheckpointEnabled, info: () => getRecoveryCheckpointSummary(recoveryPointConfiguration) },
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
    const { recoveryStatus, reverseStatus } = protectionPlan;
    if (recoveryStatus) {
      return (
        <Badge color="success" pill>{recoveryStatus.toUpperCase()}</Badge>
      );
    }
    if (reverseStatus) {
      return (
        <Badge color="info" pill className="badge badge-info margin-right-5">{reverseStatus.toUpperCase()}</Badge>
      );
    }
  }

  renderStatus() {
    const { drPlans, t } = this.props;
    const { protectionPlan } = drPlans;
    const newStatus = drPlanStatus(protectionPlan);
    if (newStatus === PROTECTION_PLANS_STATUS.STOPPED) {
      return (
        <Badge pill color="danger">{t('status.stopped')}</Badge>
      );
    }
    if (newStatus === PROTECTION_PLANS_STATUS.INIT_FAILED) {
      return (
        <Badge pill color="danger">{t('status.init.failed')}</Badge>
      );
    }
    if (newStatus === PROTECTION_PLANS_STATUS.INITIALIZING) {
      return (
        <Badge pill color="info">{t('status.initializing')}</Badge>
      );
    }
    if (newStatus === PROTECTION_PLANS_STATUS.CREATED || newStatus === PROTECTION_PLANS_STATUS.STARTED) {
      return (
        <Badge color="info" pill>{t('status.running')}</Badge>
      );
    }
    if (newStatus === PROTECTION_PLANS_STATUS.PARTIALLY_RUNNING) {
      return (
        <Badge color="warning" pill>{t('plan.status.partially.running')}</Badge>
      );
    }

    return (
      <Badge pill color="info">{t('status.running')}</Badge>
    );
  }

  renderActions() {
    const { drPlans, dispatch, t, user, jobs } = this.props;
    const { platformType, localVMIP } = user;
    const { protectionPlan, allVmRecovered } = drPlans;
    const { checkpointCount } = jobs;
    const { protectedSite, recoverySite } = protectionPlan;
    const protectedSitePlatform = protectedSite.platformDetails.platformType;
    const planHaCheckpoints = checkpointCount > 0 || false;
    const isServerActionDisabled = (protectionPlan.recoveryStatus === RECOVERY_STATUS.RECOVERED || protectionPlan.recoveryStatus === RECOVERY_STATUS.MIGRATED || !hasRequestedPrivileges(user, ['protectionplan.edit']));
    const recovered = planHaCheckpoints || !(protectionPlan.recoveryStatus === RECOVERY_STATUS.RECOVERED || protectionPlan.recoveryStatus === RECOVERY_STATUS.MIGRATED);
    const isReverseActionDisabled = this.disableReverse(protectionPlan);
    const cleanupPath = PROTECTION_PLAN_CLEANUP_PATH.replace(':id', protectionPlan.id);
    let actions = [];
    if (platformType === protectedSitePlatform && localVMIP !== recoverySite.node.hostname) {
      actions.push({ label: 'Start', action: this.startPlanCLick, id: protectionPlan.id, disabled: this.disableStart(protectionPlan), icon: faPlay });
      actions.push({ label: 'Stop', action: this.stopPlanClick, id: protectionPlan.id, disabled: this.disableStop(protectionPlan), icon: faStop });
      actions.push({ label: 'Edit', action: openEditProtectionPlanWizard, id: protectionPlan, disabled: this.disableEdit(), icon: faEdit });
      actions.push({ label: 'Resync Disk Replication', action: onResetDiskReplicationClick, id: protectionPlan, disabled: isServerActionDisabled, navigate: PROTECTION_PLANS_PATH, icon: faRetweet });
      actions.push({ label: 'Download Plan Playbook', action: playbookExport, id: protectionPlan, disabled: this.disableEdit(), icon: faDownload });
      actions.push({ label: 'Cleanup Recoveries', action: 'CHANGE_ROUTE', routePath: `${cleanupPath}`, icon: faBroom, disabled: !hasRequestedPrivileges(user, ['recovery.test']) });
      actions.push({ label: 'Remove', action: onDeleteProtectionPlanClick, id: protectionPlan.id, disabled: protectionPlan.status.toUpperCase() === REPLICATION_STATUS || !hasRequestedPrivileges(user, ['protectionplan.delete']), navigate: PROTECTION_PLANS_PATH, icon: faTrash });
    } else if (localVMIP === recoverySite.node.hostname) {
      actions = [{ label: 'recover', action: openRecoveryWizard, icon: faPlus, disabled: !recovered || protectionPlan.recoveryStatus === RECOVERY_STATUS.MIGRATED || !hasRequestedPrivileges(user, ['recovery.full']) },
        { label: 'Migrate', action: openMigrationWizard, icon: faClone, disabled: allVmRecovered || !hasRequestedPrivileges(user, ['recovery.migration']) },
        { label: 'Reverse', action: openReverseWizard, icon: faBackward, disabled: isReverseActionDisabled },
        { label: 'Test Recovery', action: openTestRecoveryWizard, icon: faCheck, disabled: allVmRecovered || !hasRequestedPrivileges(user, ['recovery.test']) },
        { label: 'Cleanup Recoveries', action: 'CHANGE_ROUTE', routePath: `${cleanupPath}`, icon: faBroom, disabled: !hasRequestedPrivileges(user, ['recovery.test']) },
        { label: 'Download Credentials Playbook', action: downloadRecoveryPlaybook, id: protectionPlan.id, icon: faDownload },
      ];
    } else {
      // no action to add
    }
    return (
      <DropdownActions title={t('actions')} dispatch={dispatch} actions={actions} uniqueID="drplan-details-actions" />
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

  renderRecoveryCheckpoint() {
    const { user } = this.props;
    const { drPlanDetailActiveTab } = user;
    const activeTab = drPlanDetailActiveTab;
    const { t } = this.props;
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

  renderSummaryRow(plan) {
    const { t, drPlans } = this.props;
    const { testRecoveryInMonth, protectionPlan } = drPlans;
    const { protectedSite } = protectionPlan;
    const { node } = protectedSite;
    const { isLocalNode } = node;
    const { replEnableTotalNumVms, recoveryTotalNumVms, numOfWorkload } = planDetailSummaryData(plan);
    return (
      <>
        <Row>
          <Col sm={isLocalNode ? 4 : 2}>
            <div className="d-flex justify-content-between">
              <div>
                <FontAwesomeIcon className="me-2" icon={faDesktop} />
                {t('workloads')}
              </div>
              <div>{numOfWorkload}</div>
            </div>
          </Col>
          {isLocalNode ? <Col sm={2} /> : null}
          <Col sm={isLocalNode ? 4 : 3} className="ms-3">
            <div className="d-flex justify-content-between">
              <div>
                <FontAwesomeIcon className="me-2" icon={faClone} />
                {t('repl.enabled')}
              </div>
              <div>{`${replEnableTotalNumVms.length} / ${numOfWorkload}`}</div>
            </div>
          </Col>
          {!isLocalNode ? (
            <>
              <Col sm={1} />
              <Col sm={3}>
                <div className="d-flex justify-content-between">
                  <div>
                    <FontAwesomeIcon icon={faCheck} />
                    {t('test.recovered.title')}
                  </div>
                  {testRecoveryInMonth && Object.keys(testRecoveryInMonth).length > 0 ? (
                    <div
                      className="d-flex"
                    >
                      <a
                        href="#"
                        className="me-3 cursor-pointer"
                        id="test-recovered-vm"
                        onClick={this.showTestRecoveredVmModal}
                      >
                        {`${testRecoveryInMonth?.tested?.length || 0} / ${numOfWorkload}`}
                      </a>
                      <DMToolTip tooltip="test.data.count" />
                    </div>
                  ) : <Spinner /> }

                </div>
              </Col>
              <Col sm={2} className="ms-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <FontAwesomeIcon className="me-2" icon={faCheckDouble} />
                    {t('recovered')}
                  </div>
                  <div>{`${recoveryTotalNumVms.length} / ${numOfWorkload}`}</div>
                </div>
              </Col>
            </>
          ) : null}
        </Row>
      </>
    );
  }

  render() {
    const { drPlans, dispatch, t, user } = this.props;
    const { drPlanDetailActiveTab } = user;
    const { protectionPlan } = drPlans;
    const activeTab = drPlanDetailActiveTab;
    if (!protectionPlan || Object.keys(protectionPlan).length === 0) {
      return null;
    }
    const { name, protectedSite, recoverySite, id } = protectionPlan;
    return (
      <>
        <Container fluid>
          <Card className="box-shadow">
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
                  {this.renderSite(protectedSite)}
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
              <hr />
              {this.renderSummaryRow(protectionPlan)}
            </CardBody>
          </Card>
          <Card className="box-shadow">
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
                <NavItem>
                  <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.FIVE })} cursor-pointer`} onClick={() => { this.toggleTab(PLAN_DETAIL_TABS.FIVE); }}>
                    <span className="d-none d-sm-block">{t('point.in.time.checkpoint')}</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.THREE })} cursor-pointer`} onClick={() => { this.toggleTab(PLAN_DETAIL_TABS.THREE); }}>
                    <span className="d-none d-sm-block">{t('replication.jobs')}</span>
                  </NavLink>
                </NavItem>
                {this.renderRecoveryCheckpoint()}
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
                <TabPane tabId={PLAN_DETAIL_TABS.THREE}>
                  <Suspense fallback={<Loader />}>
                    {activeTab === PLAN_DETAIL_TABS.THREE ? <Replication protectionplanID={id} {...this.props} /> : null}
                  </Suspense>
                </TabPane>
                <TabPane tabId={PLAN_DETAIL_TABS.SIX}>
                  <Suspense fallback={<Loader />}>
                    {activeTab === PLAN_DETAIL_TABS.SIX ? <Recovery protectionplanID={id} {...this.props} /> : null}
                  </Suspense>
                </TabPane>
                <TabPane tabId={PLAN_DETAIL_TABS.FOUR}>
                  <Suspense fallback={<Loader />}>
                    {activeTab === PLAN_DETAIL_TABS.FOUR ? <RecoveryCheckPointsJobs user={user} protectionplanID={id} {...this.props} /> : null}
                  </Suspense>
                </TabPane>
                <TabPane tabId={PLAN_DETAIL_TABS.FIVE}>
                  <Suspense fallback={<Loader />}>
                    {activeTab === PLAN_DETAIL_TABS.FIVE ? <RecoveryCheckpoints user={user} protectionplanID={id} {...this.props} /> : null}
                  </Suspense>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { drPlans } = state;
  return { drPlans };
}
export default connect(mapStateToProps)(withTranslation()(DRPlanDetails));
