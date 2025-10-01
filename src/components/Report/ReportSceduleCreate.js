import React, { useEffect, useState } from 'react';
import { Card, CardBody, Container, Label } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { getTimeZones } from '../../store/actions/NodeScheduleAction';
import { clearValues, valueChange } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import ReportSummaryStep from './ReportSummaryStep';
import ConfigureEmailStep from './ConfigureEmailStep';
import ReportSideBar from './ReportSideBar';
import ReportScheduleStep from './ReportScheduleStep';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import { REPORT_SCHEDULE_CREATE, REPORTS_PATH } from '../../constants/RouterConstants';
import Stepper from '../Common/Stepper';
import { cancelCreateSchedule, getReportSchedulePayload, setReconfigureReportScheduleData, validateCreateScheduleStep } from '../../utils/ReportUtils';
import { getValue } from '../../utils/InputUtils';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { configureReportSchedule } from '../../store/actions/ReportActions';
import { openModal } from '../../store/actions/ModalActions';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { fetchDrPlans } from '../../store/actions/DrPlanActions';
import { STATIC_KEYS } from '../../constants/InputConstants';

const ReportScheduleCreate = (props) => {
  const { user, dispatch, t, reports } = props;
  const { selectedSchedule } = reports;
  const [steps, setSteps] = useState([
    { label: 'Schedule', state: '', isDisabled: false },
    { label: 'Configure', state: '', isDisabled: false },
    { label: 'Email', state: '', isDisabled: false },
    { label: 'Summary', state: '', isDisabled: false },
  ]);
  const flow = getValue(STORE_KEYS.UI_REPORT_SCHEDULE_WORKFLOW, user.values);
  const [currentStep, setCurrentStep] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const id = pathParts[pathParts.length - 1];

  useEffect(() => {
    dispatch(getTimeZones());
    dispatch(fetchDrPlans(STATIC_KEYS.UI_PROTECTION_PLANS));
    dispatch(valueChange('report.system.includeSystemOverView', true));
    const defaultTime = new Date();
    if (flow === STATIC_KEYS.EDIT || !Number.isNaN(+id)) {
      const selectedKey = Object.keys(selectedSchedule)[0];
      const data = selectedSchedule[selectedKey];
      if (!data || Object.keys(data).length === 0) {
        const path = REPORT_SCHEDULE_CREATE.replace('*', 'create');
        history.push(path);
      } else {
        dispatch(setReconfigureReportScheduleData(data));
      }
    }
    if (flow !== STATIC_KEYS.EDIT && Number.isNaN(+id)) {
      dispatch(valueChange(STORE_KEYS.UI_REPORT_SCHEDULER_GENERATE_ON_TIME, defaultTime));
      dispatch(valueChange(STORE_KEYS.UI_REPORT_SCHEDULER_OCCURRENCE, 1));
      dispatch(valueChange(STORE_KEYS.UI_REPORT_SCHEDULER_OCCURRENCE_OPTION, STATIC_KEYS.WEEK));
      dispatch(valueChange(STORE_KEYS.UI_REPORT_SCHEDULER_MAINTAIN, 1));
    }
    return (() => {
      dispatch(clearValues());
    });
  }, [id]);

  useEffect(() => {
    dispatch(clearValues());
    dispatch(valueChange('report.system.includeSystemOverView', true));
    dispatch(valueChange(STATIC_KEYS.REPORT_DURATION_TYPE, STATIC_KEYS.MONTH));
  }, []);

  const handleStepClick = (index) => {
    if (steps[index].state === 'done' && !steps[index].isDisabled) {
      setCurrentStep(index);
    }
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ReportScheduleStep />;
      case 1:
        return <ReportSideBar showFormat />;
      case 2:
        return <ConfigureEmailStep />;
      case 3:
        return <ReportSummaryStep />;
      default:
        return null;
    }
  };

  const renderFooter = () => {
    const isLastStep = currentStep === steps.length - 1;

    const handleBack = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    const handleCancel = () => {
      const options = { title: t('confirmation'), confirmAction: cancelCreateSchedule, message: 'Are you sure you want to exit the report scheduling process? Progress made so far won’t be saved.' };
      dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
    };

    const handleNext = () => {
      const isValid = validateCreateScheduleStep(user, dispatch, currentStep);
      const time = getValue(STORE_KEYS.UI_REPORT_SCHEDULER_GENERATE_ON_TIME, user.values);
      if (currentStep === 0 && (time === null || time === '')) {
        dispatch(addMessage('Invalid create at time', MESSAGE_TYPES.ERROR));
        return;
      }
      if (!isValid) {
        return;
      }
      if (isLastStep) {
        const selectedKey = Object.keys(selectedSchedule)[0];
        const data = selectedSchedule[selectedKey];
        const payload = getReportSchedulePayload(user, data);
        if (flow !== STATIC_KEYS.EDIT) {
          dispatch(configureReportSchedule(payload, false, history));
        } else {
          payload.savedReports = data?.savedReports;
          payload.createdTime = data?.createdTime;
          dispatch(configureReportSchedule(payload, true, history, +id));
        }
      } else {
        const updatedSteps = [...steps];
        updatedSteps[currentStep].state = 'done';
        setSteps(updatedSteps);
        setCurrentStep(currentStep + 1);
      }
    };

    return (
      <div className="modal-footer ml-5">
        <div>
          <button type="button" className="btn btn-secondary me-3" onClick={handleCancel}>
            {t('Cancel')}
          </button>
          <button style={{ marginRight: '15px' }} type="button" className="btn btn-secondary" onClick={handleBack} disabled={currentStep === 0}>
            {t('Back')}
          </button>
          <button type="button" className={`${isLastStep ? 'btn btn-success' : 'btn btn-secondary'}`} onClick={handleNext}>
            {isLastStep ? t('Submit') : t('Next')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <Container fluid>
      <Card>
        <CardBody style={{ minHeight: '100vh' }}>
          <DMBreadCrumb links={[{ label: 'report', link: '#' }]} />
          <DMBreadCrumb links={[{ label: 'Scheduled Reports', link: REPORTS_PATH }, { label: `${flow !== STATIC_KEYS.EDIT ? 'Create' : 'Reconfigure'}`, link: '#' }]} />
          <Label className="mt-2 mb-5" style={{ marginLeft: '1%' }}>Create New Scheduler</Label>
          <Stepper steps={steps} currentStep={currentStep} onStepChange={handleStepClick} />
          <div style={{ marginTop: '30px', minHeight: '500px' }}>
            {renderStepContent()}
          </div>
          {renderFooter()}
        </CardBody>
      </Card>
    </Container>
  );
};

function mapStateToProps(state) {
  const { reports, user } = state;
  return { reports, user };
}

export default connect(mapStateToProps)(withTranslation()(ReportScheduleCreate));
