import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import DMSearchSelect from '../Shared/DMSearchSelect';
import DMTimePicker from '../Shared/DMTimePicker';
import { STATIC_KEYS } from '../../constants/InputConstants';
import DaySelector from '../Common/DaySelector';
import DMFieldText from '../Shared/DMFieldText';
import DMFieldSelect from '../Shared/DMFieldSelect';
import DMToolTip from '../Shared/DMToolTip';
import { FIELDS } from '../../constants/FieldsConstant';
import DMFieldNumber from '../Shared/DMFieldNumber';
import { getReportScheduleText } from '../../utils/ReportUtils';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { getValue } from '../../utils/InputUtils';

const ReportScheduleStep = (props) => {
  const { dispatch, user, t } = props;
  const occurrenceOption = getValue(STORE_KEYS.UI_REPORT_SCHEDULER_OCCURRENCE_OPTION, user.values);
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const copies = getValue('ui.report.scheduler.maintain', user.values) || '';

  const renderDays = () => {
    if (occurrenceOption === STATIC_KEYS.WEEK) {
      return (
        <Row className="ms-3 mb-3">
          <Col sm={3}><p>{t('day.of.week')}</p></Col>
          <Col sm={5} className="pl-4">
            <DaySelector user={user} dispatch={dispatch} options={days} fieldkey={STORE_KEYS.UI_REPORT_SCHEDULER_DAY_OF_WEEK} occurenceKey={STORE_KEYS.UI_REPORT_SCHEDULER_OCCURRENCE} />
          </Col>
          <Col sm={1} className="pb-3">
            <DMToolTip tooltip={t('select.day.of.week')} />
          </Col>
        </Row>
      );
    }
    if (occurrenceOption === STATIC_KEYS.MONTH) {
      return (
        <Row className="ms-3 mt-1 mb-2">
          <Col sm={3}><p>{t('date.of.month')}</p></Col>
          <Col sm={3}>
            <DMFieldNumber dispatch={dispatch} fieldKey={STORE_KEYS.UI_REPORT_SCHEDULER_DAY_OF_MONTH} field={FIELDS['ui.report.schedule.day.of.month']} user={user} hideLabel />
          </Col>
          <Col sm={2} />
          <Col sm={1} className="pb-3">
            <DMToolTip tooltip={t('select.date.of.month')} />
          </Col>
        </Row>
      );
    }
    return null;
  };

  const renderSummary = () => (
    <div className="ms-4">
      <p>{t('schedule.summarry')}</p>
      <ul className="text-warning mb-1">
        <li>{getReportScheduleText(user)}</li>
        {copies && <li>{`Maintain ${copies} copies`}</li>}
      </ul>
    </div>
  );

  return (
    <>
      <Row className="ms-3 mb-2">
        <Col sm={3} className="mt-1"><p>{t('Schedule Name')}</p></Col>
        <Col sm={3}>
          <DMFieldText dispatch={dispatch} fieldKey={STORE_KEYS.UI_REPORT_SCHEDULER_NAME} field={FIELDS['ui.report.schedule.name']} user={user} hideLabel />
        </Col>
        <Col sm={2} />
        <Col sm={1} className="pb-3">
          <DMToolTip tooltip={t('shedule.report.name.info')} />
        </Col>
      </Row>
      <Row className="ms-3 mb-2">
        <Col sm={3} className="mt-1"><p>{t('Frequency')}</p></Col>
        <Col sm={3}>
          <DMFieldSelect dispatch={dispatch} fieldKey={STORE_KEYS.UI_REPORT_SCHEDULER_OCCURRENCE_OPTION} field={FIELDS['ui.report.schedule.day']} user={user} hideLabel />
        </Col>
        {occurrenceOption === STATIC_KEYS.HOURLY ? (
          <Col sm={2}>
            <DMFieldNumber dispatch={dispatch} fieldKey={STORE_KEYS.UI_REPORT_SCHEDULER_OCCURRENCE} field={FIELDS['ui.report.schedule.occurrence']} user={user} hideLabel />
          </Col>
        ) : <Col sm={2} />}
        <Col sm={1} className="pb-3">
          <DMToolTip tooltip={t('shedule.report.occurence.info')} />
        </Col>
      </Row>
      {renderDays()}
      {occurrenceOption !== STATIC_KEYS.HOURLY && (
      <Row className="ms-3 mt-2 mb-2">
        <Col sm={3}><p>{t('Create At')}</p></Col>
        <Col sm={3} style={{ paddingRight: '3%' }}>
          <DMTimePicker dispatch={dispatch} fieldKey={STORE_KEYS.UI_REPORT_SCHEDULER_GENERATE_ON_TIME} field={FIELDS['ui.report.schedule.time']} user={user} hideLabel />
        </Col>
        <Col sm={2} />
        <Col sm={1} className="pb-3">
          <DMToolTip tooltip={t('shedule.report.time.info')} />
        </Col>
      </Row>
      )}
      <Row className="ms-3 mb-2">
        <Col sm={3} className="mt-1"><p>{t('Maintain Copies')}</p></Col>
        <Col sm={3}>
          <DMFieldNumber dispatch={dispatch} fieldKey={STORE_KEYS.UI_REPORT_SCHEDULER_MAINTAIN} field={FIELDS['ui.report.maintain.copies']} user={user} hideLabel />
        </Col>
        <Col sm={2} />
        <Col sm={1} className="pb-3">
          <DMToolTip tooltip={t('shedule.report.maintain.copy.info')} />
        </Col>
      </Row>
      <Row className="ms-3 mb-2">
        <Col sm={3} className="mt-1"><p>{t('schedule.time.zone')}</p></Col>
        <Col sm={3}>
          <DMSearchSelect dispatch={dispatch} fieldKey={STORE_KEYS.UI_REPORT_SCHEDULE_TIME_ZONE} field={FIELDS['ui.report.schedule.time.zone']} user={user} hideLabel />
        </Col>
        <Col sm={2} />
        <Col sm={1} className="pb-3">
          <DMToolTip tooltip={t('time.zone.info')} />
        </Col>
      </Row>
      {renderSummary()}
    </>
  );
};

function mapStateToProps(state) {
  const { settings, user } = state;
  return { settings, user };
}
export default connect(mapStateToProps)(withTranslation()(ReportScheduleStep));
