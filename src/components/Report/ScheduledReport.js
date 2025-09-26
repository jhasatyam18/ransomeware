import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Card, CardBody, Col, Container, Form, Label, Row } from 'reactstrap';
import { faCircleCheck, faCircleMinus, faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { API_SCHEDULED_JOBS } from '../../constants/ApiConstants';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import { REPORT_SCHEDULE_CREATE } from '../../constants/RouterConstants';
import DMTable from '../Table/DMTable';
import { TABLE_FILTER_TEXT, TABLE_SCHEDULE, TABLE_SCHEDULE_JOB } from '../../constants/TableConstants';
import ActionButton from '../Common/ActionButton';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import { clearValues, valueChange } from '../../store/actions';
import { openModal } from '../../store/actions/ModalActions';
import { MODAL_CHANGE_SCHEDULE_STATUS, MODAL_CONFIRMATION_WARNING, MODAL_EMAIL_CONFIGURATION } from '../../constants/Modalconstant';
import DMTPaginator from '../Table/DMTPaginator';
import { filterData } from '../../utils/AppUtils';
import { configureReportSchedule, handleReportScheduleTableSelection, removeReportSchedule, setReportScheduleJob } from '../../store/actions/ReportActions';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { setReconfigureReportScheduleData } from '../../utils/ReportUtils';
import { fetchEmailConfig } from '../../store/actions/EmailActions';

const ScheduledReport = (props) => {
  const { settings, t, user, dispatch, reports } = props;
  const { email } = settings;
  const { scheduledReports, scheduledReportsJobs, selectedSchedule } = reports;
  const [viewJobs, setViewJobs] = useState(false);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [hasFilterString, setHasFilterString] = useState(false);
  const [configDataToDisplay, setConfigDataToDisplay] = useState([]);
  const [configSearchData, setConfigSearchData] = useState([]);
  const [configHasFilterString, setConfigHasFilterString] = useState(false);
  const history = useHistory();
  const disableAction = Object.keys(selectedSchedule).length !== 1;
  const disableEnable = Object.keys(selectedSchedule).length !== 1 || !selectedSchedule[Object.keys(selectedSchedule)[0]].disabled;
  const disableDisableBtn = Object.keys(selectedSchedule).length !== 1 || selectedSchedule[Object.keys(selectedSchedule)[0]].disabled;

  const setDataForDisplay = (data) => {
    if (viewJobs) {
      setDataToDisplay(data);
    } else {
      setConfigDataToDisplay(data);
    }
  };

  useEffect(() => {
    dispatch(fetchEmailConfig());
    const vmData = (hasFilterString ? searchData : scheduledReportsJobs) || [];
    const vmConfigData = (configHasFilterString ? configSearchData : scheduledReports) || [];
    const data = viewJobs ? vmData : vmConfigData;
    setDataForDisplay(data);
  }, [searchData, scheduledReportsJobs, configSearchData, scheduledReports]);

  const onConfigureEmail = () => {
    const options = { title: 'Configure Email Settings', email: null, isUpdate: false };
    dispatch(clearValues());
    dispatch(openModal(MODAL_EMAIL_CONFIGURATION, options));
  };

  const onFilter = (criteria) => {
    if (viewJobs) {
      const data = (scheduledReportsJobs.length > 0 ? scheduledReportsJobs : []);
      if (criteria.trim() === '') {
        setHasFilterString(false);
        setSearchData([]);
      } else {
        const newData = filterData(data, criteria.trim(), TABLE_SCHEDULE_JOB);
        setHasFilterString(true);
        setSearchData(newData);
      }
    } else {
      const data = (scheduledReports.length > 0 ? scheduledReports : []);
      if (criteria.trim() === '') {
        setConfigHasFilterString(false);
        setConfigSearchData([]);
      } else {
        const newData = filterData(data, criteria.trim(), TABLE_SCHEDULE);
        setConfigHasFilterString(true);
        setConfigSearchData(newData);
      }
    }
  };

  const renderOptions = () => (
    <Form className="padding-left-25">
      <div className="form-check-inline">
        <Label className="form-check-label" for="plan-protected-entities-opt">
          <input type="radio" className="form-check-input" id="plan-protected-entities-opt" name="protectionVMDetails" checked={!viewJobs} onChange={() => { setViewJobs(false); }} />
          {t('Schedules')}
        </Label>
      </div>
      <div className="form-check-inline">
        <Label className="form-check-label" for="plan-recovery-entities-opt">
          <input type="radio" className="form-check-input" id="plan-recovery-entities-opt" name="protectionVMDetails" checked={viewJobs} onChange={() => { setViewJobs(true); }} />
          {t('Jobs')}
        </Label>
      </div>
    </Form>
  );
  const renderError = () => {
    if (!email || Object.keys(email).length === 0) {
      return (
        <Row>
          <Col sm={6} className="text-danger"> Email settings not configured.</Col>
          <Col sm={6}>
            <ActionButton label="Configure Now" onClick={onConfigureEmail} isDisabled={!hasRequestedPrivileges(user, ['email.config'])} t={t} key="configureEmail" />
          </Col>
        </Row>
      );
    }
  };

  const renderScheduledJobs = () => (
    <>
      <Col sm="12">
        <DMTable
          dispatch={dispatch}
          columns={TABLE_SCHEDULE_JOB}
          data={dataToDisplay}
          user={user}
        />
      </Col>
    </>
  );
  const renderScheduledReports = () => (
    <>
      <Col sm="12">
        <DMTable
          dispatch={dispatch}
          columns={TABLE_SCHEDULE}
          data={configDataToDisplay}
          primaryKey="id"
          isSelectable
          onSelect={handleReportScheduleTableSelection}
          selectedData={selectedSchedule}
          user={user}
        />
      </Col>
    </>
  );

  const modalComponent = () => {
    const selectedScheduleKey = Object.keys(selectedSchedule);
    const msg = `Are you sure you want to delete the - ${selectedSchedule[selectedScheduleKey].name}? Once deleted, no new reports will be generated from it.`;
    return (
      <>
        <div className="modal-body noPadding">
          <div className="container padding-10">
            <div className="row">
              <div className="col-sm-1 confirmation-icon">
                <i className="fas fa-exclamation-triangle text-warning" />
              </div>
              <div className="col-sm-10 confirmation_modal_msg">
                {msg}
              </div>
              <p className="col-sm-10 confirmation_modal_msg text-warning" style={{ paddingLeft: '43px' }}>
                {t('Note: Deleting this schedule will also remove the saved report copies generated from it')}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const onRemove = () => {
    const selectedScheduleKey = Object.keys(selectedSchedule);
    const options = { title: t('confirmation'), confirmAction: removeReportSchedule, component: modalComponent, id: selectedSchedule[selectedScheduleKey].id };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onReconfigure = () => {
    dispatch(valueChange(STORE_KEYS.UI_REPORT_SCHEDULE_WORKFLOW, STATIC_KEYS.EDIT));
    const selectedKey = Object.keys(selectedSchedule)[0]; // since only 1 is allowed
    const data = selectedSchedule[selectedKey];
    if (!data) return;
    const path = REPORT_SCHEDULE_CREATE.replace('*', data.id) || '';
    history.push(path);
    dispatch(setReconfigureReportScheduleData(data));
  };

  const onEnableSchedule = (val) => {
    const selectedKey = Object.keys(selectedSchedule)[0];
    const data = selectedSchedule[selectedKey];
    const payload = { ...data, disabled: val };
    const options = { title: 'Confirmation', confirmAction: configureReportSchedule, message: `Are you sure you want to make ${data?.name} schedule ${val ? 'disable' : 'enable'}`, payload, history };
    dispatch(openModal(MODAL_CHANGE_SCHEDULE_STATUS, options));
  };

  const handleNewSchedule = () => {
    const path = REPORT_SCHEDULE_CREATE.replace('*', 'create');
    history.push(path);
  };

  const renderScheduledReport = () => {
    if (email && Object.keys(email).length > 0) {
      const url = API_SCHEDULED_JOBS;
      const vmData = (hasFilterString ? searchData : scheduledReportsJobs) || [];
      const vmConfigData = (configHasFilterString ? configSearchData : scheduledReports) || [];
      return (
        <div>
          <Row className="pr-4">
            <Col sm={12}>{renderOptions()}</Col>
            <Col sm={5} className="mt-4">
              {!viewJobs ? (
                <div className="btn-group padding-left-20" role="group" aria-label="First group">
                  <ActionButton label="New" icon={faPlus} onClick={handleNewSchedule} isDisabled={!hasRequestedPrivileges(user, ['scheduledreport.create'])} t={t} key="reportScheduleConfiguration" />
                  <ActionButton label="Edit" icon={faEdit} onClick={onReconfigure} isDisabled={disableAction || !hasRequestedPrivileges(user, ['scheduledreport.edit'])} t={t} key="reportScheduleEdit" />
                  <ActionButton label="Delete" icon={faTrash} onClick={onRemove} isDisabled={disableAction || !hasRequestedPrivileges(user, ['scheduledreport.delete'])} t={t} key="reportScheduleDelete" />
                  <ActionButton label="Enable" onClick={() => onEnableSchedule(false)} icon={faCircleCheck} t={t} key="resetUserPassword" isDisabled={disableEnable || !hasRequestedPrivileges(user, ['scheduledreport.edit'])} />
                  <ActionButton label="Disable" onClick={() => onEnableSchedule(true)} icon={faCircleMinus} t={t} key="resetUserPassword" isDisabled={disableDisableBtn || !hasRequestedPrivileges(user, ['scheduledreport.edit'])} />
                </div>
              ) : null}
            </Col>
            {viewJobs && (
              <Col sm={7} className="mt-3">
                <DMAPIPaginator
                  showFilter="true"
                  columns={TABLE_SCHEDULE_JOB}
                  filterHelpText={TABLE_FILTER_TEXT.REPLICATION_JOBS}
                  apiUrl={url}
                  isParameterizedUrl="false"
                  storeFn={setReportScheduleJob}
                  name="replicationDisks"
                  fetchInInterval
                />
              </Col>
            )}
            {!viewJobs && (
            <Col sm={7} className="mt-3">
              <DMTPaginator
                id={viewJobs ? 'scheduledjobs' : 'scheduledreport'}
                data={viewJobs ? vmData : vmConfigData}
                setData={setDataForDisplay}
                showFilter="true"
                onFilter={onFilter}
                columns={viewJobs ? TABLE_SCHEDULE_JOB : TABLE_SCHEDULE}
                filterHelpText={viewJobs ? TABLE_FILTER_TEXT.TABLE_PROTECTION_PLAN_VMS : TABLE_FILTER_TEXT.TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG}
              />
            </Col>
            )}
          </Row>
          <Row>
            {viewJobs ? renderScheduledJobs() : renderScheduledReports()}
          </Row>
        </div>
      );
    }
  };
  return (
    <>
      <Container fluid>
        <Card>
          <CardBody>
            {renderError()}
            {renderScheduledReport()}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

function mapStateToProps(state) {
  const { settings, user, reports } = state;
  return { settings, user, reports };
}
export default connect(mapStateToProps)(withTranslation()(ScheduledReport));
