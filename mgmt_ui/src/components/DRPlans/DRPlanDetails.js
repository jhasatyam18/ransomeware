import { faBackward, faBroom, faCheck, faCheckDouble, faClone, faDesktop, faDownload, faEdit, faPlay, faPlus, faRetweet, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import React, { Suspense, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import { useNavigate } from 'react-router-dom';
import { Badge, Card, CardBody, CardTitle, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { PLATFORM_TYPES, PROTECTION_PLANS_STATUS, RECOVERY_STATUS, REPLICATION_STATUS } from '../../constants/InputConstants';
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

const Replication = React.lazy(() => import('../Jobs/Replication'));
const Recovery = React.lazy(() => import('../Jobs/Recovery'));
const RecoveryCheckPointsJobs = React.lazy(() => import('../Jobs/RecoveryCheckpointsJobs'));
const RecoveryCheckpoints = React.lazy(() => import('../Jobs/RecoveryCheckpoints'));

function DRPlanDetails(props) {
  const { dispatch, drPlans, t, user, jobs } = props;
  const { protectionPlan } = drPlans;
  const history = useNavigate();
  const { drPlanDetailActiveTab } = user;
  const activeTab = drPlanDetailActiveTab || '1';
  const refresh = useSelector((state) => state.user.context.refresh);
  useEffect(() => {
    const { pathname } = window.location;
    const parts = pathname.split('/');
    dispatch(fetchDRPlanById(parts[parts.length - 1]));
    dispatch(fetchCheckpointsByPlanId(parts[parts.length - 1]));
  }, [refresh]);

  useEffect(() => () => {
    dispatch(setVmlevelCheckpoints([]));
    dispatch(setCheckpointCount(0));
    dispatch(drPlanDetailsFetched({}));
  }, []);

  if (!protectionPlan || Object.keys(protectionPlan).length === 0) {
    return null;
  }
  const { name, protectedSite, recoverySite, id } = protectionPlan;

  function stopPlanClick() {
    return () => {
      history(`${PROTECTION_PLAN_FLOW.replace(':id', protectionPlan.id).replace(':flow', 'stop')}`);
    };
  }

  function startPlanCLick() {
    return () => {
      history(`${PROTECTION_PLAN_FLOW.replace(':id', protectionPlan.id).replace(':flow', 'start')}`);
    };
  }

  function disableEdit() {
    if (!protectionPlan) {
      return true;
    }
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

  function disableStart(plan) {
    const newStatus = drPlanStatus(plan);
    return (isPlanRecovered(plan) || newStatus === REPLICATION_STATUS.INIT_FAILED || newStatus === REPLICATION_STATUS.INITIALIZING || !hasRequestedPrivileges(user, ['protectionplan.status']));
  }

  function disableStop(plan) {
    return (isPlanRecovered(plan) || plan.status === REPLICATION_STATUS.INIT_FAILED || plan.status === REPLICATION_STATUS.INITIALIZING || !hasRequestedPrivileges(user, ['protectionplan.status']));
  }

  function toggleTab(tab) {
    if (activeTab !== tab) {
      dispatch(setActiveTab(tab));
    }
  }

  function disableReverse(plan) {
    const recoverySitePlatform = recoverySite.platformDetails.platformType;
    if (recoverySitePlatform === PLATFORM_TYPES.GCP) {
      return true;
    }
    if (!(plan.recoveryStatus === RECOVERY_STATUS.RECOVERED || plan.recoveryStatus === RECOVERY_STATUS.MIGRATED)) {
      return true;
    }
    return !hasRequestedPrivileges(user, ['recovery.reverse']);
  }

  function showTestRecoveredVm() {
    const { testRecoveryInMonth } = drPlans;
    const { tested, notTested } = testRecoveryInMonth;
    return (
      <>
        <SimpleBar style={{ maxHeight: '40vh', minHeight: '10vh', textAlign: 'center' }}>
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

  function footer() {
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

  function showTestRecoveredVmModal() {
    const options = { title: 'Test Recovered Virtual Machines', footerComponent: footer, node: null, isUpdate: false, component: showTestRecoveredVm, size: 'lg' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  function renderSite(site) {
    if (!site || !site.platformDetails) {
      return null;
    }
    const { platformDetails, node } = site;
    const { platformType } = platformDetails;
    const keys = [{ label: 'Name', field: site.name }, { label: 'Platform Type', field: platformDetails.platformType }, { label: PLATFORM_TYPES.Azure === platformType ? 'Storage Account' : 'Hostname', field: platformDetails.hostname },
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

  function renderField(label, field, value, data, info) {
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

  function renderRecoverFields(keys) {
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
              {renderField(label, protectionPlan[field], value, data, info)}
            </div>
          </div>
        );
      }
      return null;
    });
    return fields;
  }

  function renderRecoveryConfig() {
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
          {renderRecoverFields(keys.slice(0, 5))}
        </Col>
        <Col sm={4}>
          {renderRecoverFields(keys.slice(5, 10))}
        </Col>
        <Col sm={4}>
          {renderRecoverFields(keys.slice(10, 15))}
        </Col>
      </Row>
    );
  }

  function renderRecoveryStatus() {
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

  function renderStatus() {
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

  function renderActions() {
    const { platformType, localVMIP } = user;
    const { allVmRecovered } = drPlans;
    const { checkpointCount } = jobs;
    const protectedSitePlatform = protectedSite.platformDetails.platformType;
    const planHaCheckpoints = checkpointCount > 0 || false;
    const isServerActionDisabled = (protectionPlan.recoveryStatus === RECOVERY_STATUS.RECOVERED || protectionPlan.recoveryStatus === RECOVERY_STATUS.MIGRATED || !hasRequestedPrivileges(user, ['protectionplan.edit']));
    const recovered = planHaCheckpoints || !(protectionPlan.recoveryStatus === RECOVERY_STATUS.RECOVERED || protectionPlan.recoveryStatus === RECOVERY_STATUS.MIGRATED);
    const isReverseActionDisabled = disableReverse(protectionPlan);
    const cleanupPath = PROTECTION_PLAN_CLEANUP_PATH.replace(':id', protectionPlan.id);
    let actions = [];
    if (platformType === protectedSitePlatform && localVMIP !== recoverySite.node.hostname) {
      actions.push({ label: 'Start', action: startPlanCLick, id: protectionPlan.id, disabled: disableStart(protectionPlan), icon: faPlay });
      actions.push({ label: 'Stop', action: stopPlanClick, id: protectionPlan.id, disabled: disableStop(protectionPlan), icon: faStop });
      actions.push({ label: 'Edit', action: openEditProtectionPlanWizard, id: protectionPlan, disabled: disableEdit(), icon: faEdit });
      actions.push({ label: 'Resync Disk Replication', action: onResetDiskReplicationClick, id: protectionPlan, disabled: isServerActionDisabled, navigate: PROTECTION_PLANS_PATH, icon: faRetweet });
      actions.push({ label: 'Download Plan Playbook', action: playbookExport, id: protectionPlan, disabled: disableEdit(), icon: faDownload });
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

  function renderRecoveryJobs() {
    const { localVMIP } = user;
    if (localVMIP === recoverySite.node.hostname) {
      return (
        <NavItem>
          <NavLink className={`${classnames({ active: activeTab === '6' })} cursor-pointer`} onClick={() => { toggleTab('6'); }}>
            <span className="d-none d-sm-block">{t('recovery.jobs')}</span>
          </NavLink>
        </NavItem>
      );
    }
    return null;
  }

  function renderRecoveryCheckpoint() {
    return (
      <>
        <NavItem>
          <NavLink className={`${classnames({ active: activeTab === '4' })} cursor-pointer`} onClick={() => { toggleTab('4'); }}>
            <span className="d-none d-sm-block">{t('checkpoint.jobs')}</span>
          </NavLink>
        </NavItem>
      </>
    );
  }

  function renderSummaryRow(plan) {
    const { testRecoveryInMonth } = drPlans;
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
                        onClick={showTestRecoveredVmModal}
                      >
                        {`${testRecoveryInMonth?.tested?.length || 0} / ${numOfWorkload}`}
                      </a>
                      <DMToolTip tooltip="test.data.count" />
                    </div>
                  ) : <Spinner />}

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
                  {renderRecoveryStatus()}
                  {renderStatus()}
                </CardTitle>
              </Col>
              <Col sm={4}>
                {renderActions()}
              </Col>
            </Row>
            <Row className="margin-left-5">
              <Col sm={5}>
                <CardTitle className="title-color">{t('protected.site')}</CardTitle>
                {renderSite(protectedSite)}
              </Col>
              <Col sm={2}>
                <div className="stack__info">
                  <div className="line" />
                </div>
              </Col>
              <Col sm={5}>
                <CardTitle className="title-color">{t('recovery.site')}</CardTitle>
                {renderSite(recoverySite, true)}
              </Col>
            </Row>
            <hr />
            {renderSummaryRow(protectionPlan)}
          </CardBody>
        </Card>
        <Card className="box-shadow">
          <CardBody>
            <Nav tabs className="nav-tabs-custom nav-justified">
              <NavItem>
                <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.ONE })} cursor-pointer`} onClick={() => { toggleTab(PLAN_DETAIL_TABS.ONE); }}>
                  <span className="d-none d-sm-block">{t('Virtual Machines')}</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.TWO })} cursor-pointer`} onClick={() => { toggleTab(PLAN_DETAIL_TABS.TWO); }}>
                  <span className="d-none d-sm-block">{t('Configuration')}</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.FIVE })} cursor-pointer`} onClick={() => { toggleTab(PLAN_DETAIL_TABS.FIVE); }}>
                  <span className="d-none d-sm-block">{t('point.in.time.checkpoint')}</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.THREE })} cursor-pointer`} onClick={() => { toggleTab(PLAN_DETAIL_TABS.THREE); }}>
                  <span className="d-none d-sm-block">{t('replication.jobs')}</span>
                </NavLink>
              </NavItem>
              {renderRecoveryCheckpoint()}
              {renderRecoveryJobs()}
            </Nav>
            <TabContent activeTab={activeTab}>
              <TabPane tabId={PLAN_DETAIL_TABS.ONE} className="p-3">
                <ProtectionPlanVMConfig protectionPlan={protectionPlan} dispatch={dispatch} />
              </TabPane>
              <TabPane tabId={PLAN_DETAIL_TABS.TWO} className="p-3">
                <Row>
                  <Col sm="12">
                    {renderRecoveryConfig()}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId={PLAN_DETAIL_TABS.THREE} className="p-3">
                <Row>
                  <Col sm="12">
                    <Suspense fallback={<Loader />}>
                      {activeTab === PLAN_DETAIL_TABS.THREE ? <Replication protectionplanID={id} {...props} /> : null}
                    </Suspense>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId={PLAN_DETAIL_TABS.SIX} className="p-3">
                <Row>
                  <Col sm="12">
                    <Suspense fallback={<Loader />}>
                      {activeTab === PLAN_DETAIL_TABS.SIX ? <Recovery protectionplanID={id} {...props} /> : null}
                    </Suspense>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId={PLAN_DETAIL_TABS.FOUR} className="p-3">
                <Row>
                  <Col sm="12">
                    <Suspense fallback={<Loader />}>
                      {activeTab === PLAN_DETAIL_TABS.FOUR ? <RecoveryCheckPointsJobs user={user} protectionplanID={id} {...props} /> : null}
                    </Suspense>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId={PLAN_DETAIL_TABS.FIVE} className="p-3">
                <Row>
                  <Col sm="12">
                    <Suspense fallback={<Loader />}>
                      {activeTab === PLAN_DETAIL_TABS.FIVE ? <RecoveryCheckpoints user={user} protectionplanID={id} {...props} /> : null}
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

function mapStateToProps(state) {
  const { drPlans, jobs } = state;
  return { drPlans, jobs };
}
export default connect(mapStateToProps)(withTranslation()(DRPlanDetails));
