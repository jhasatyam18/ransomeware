import React, { useEffect } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import { useHistory } from 'react-router-dom';
import DMFieldNumber from '../../Shared/DMFieldNumber';
import { convertScheduleToCron, defaultTimeZone, formatTime, getMinMaxForSchedulerOccurence, getPowerOffDayInterval, getScheduleSummary, onOccurenceOptionChange, showDayOfMonthField, toOrdinal } from '../../../utils/SystemUpdateScheduleUtils';
import { clearValues, valueChange } from '../../../store/actions';
import { getValue } from '../../../utils/InputUtils';
import DaySelector from '../../Common/DaySelector';
import DMFieldSelect from '../../Shared/DMFieldSelect';
import { isEmpty, validateConfigureShedule } from '../../../utils/validationUtils';
import { STORE_KEYS } from '../../../constants/StoreKeyConstants';
import { FIELD_TYPE, TIME_PICKER_COMP } from '../../../constants/FieldsConstant';
import DMTable from '../../Table/DMTable';
import { TABLE_NODE_SCHEDULER } from '../../../constants/TableConstants';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import { NODE_UPDATE_SCHEDULER } from '../../../constants/RouterConstants';
import { configureSchedule, getScheduleDaysLater, getTimeZones, handleCreateNodeScheduleSelection, setSelectedCreateScheduledNodes } from '../../../store/actions/NodeScheduleAction';
import DMToolTip from '../../Shared/DMToolTip';
import DMTimePicker from '../../Shared/DMTimePicker';
import DMSearchSelect from '../../Shared/DMSearchSelect';
import { NODE_TYPES, STATIC_KEYS } from '../../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { addMessage } from '../../../store/actions/MessageActions';

function NodeUpdateScheduleCreate(props) {
  const { dispatch, user, settings, t } = props;
  const { nodes, scheduledNodes = [], selectedCreateScheduledNodes = {}, selectedScheduledNodes = {} } = settings;
  const history = useHistory();
  const data = nodes
    ?.filter((node) => node.nodeType === NODE_TYPES.PrepNode)
    .filter((node) => !scheduledNodes.some((s) => s.node.id === node.id));
  const selectedKey = Object.keys(selectedScheduledNodes)[0]; // since only 1 is allowed
  const powerOffDayOptions = getValue(STORE_KEYS.UI_SCHEDULE_DAYS_LATER_OPTION, user.values) || [];
  const reconfigureData = selectedKey ? [selectedScheduledNodes[selectedKey].node] : [];
  const occurrenceText = { label: '', placeHolderText: '', type: FIELD_TYPE.NUMBER, validate: (value) => isEmpty(value, user), errorMessage: 'Enter Occurrence.', shouldShow: true, min: 1, getMinMax: () => getMinMaxForSchedulerOccurence(user) };
  const dayOfMonthText = { label: '', placeHolderText: '', type: FIELD_TYPE.NUMBER, validate: (value) => isEmpty(value, user), errorMessage: 'Enter day of month.', shouldShow: (fieldkey) => showDayOfMonthField(fieldkey, user), defaultValue: 1, min: 1, max: 30 };
  const occurrenceSelect = { label: '', onChange: onOccurenceOptionChange, errorMessage: 'Select Occurrence', options: [{ label: 'Day', value: 'day' }, { label: 'Week', value: 'week' }, { label: 'Month', value: 'month' }], shouldShow: true, validate: (value) => isEmpty(value, user), defaultValue: 'day' };
  const powerOffAtDay = { label: '', errorMessage: '', options: powerOffDayOptions, shouldShow: true, validate: (value) => isEmpty(value, user) };
  const powerOnTimeField = { label: '', COMPONENT: TIME_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value) => isEmpty(value, user) };
  const powerOffTimeField = { label: '', COMPONENT: TIME_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value) => isEmpty(value, user) };
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const timeZoneOptions = getValue(STORE_KEYS.UI_SCHEDULE_TIME_ZONE_OPTIONS, user.values) || [];
  const timeZoneField = { label: '', type: FIELD_TYPE.SELECT_SEARCH, shouldShow: true, options: timeZoneOptions, validate: (value, u) => isEmpty(value, u), errorMessage: 'Select Zone', defaultValue: (fieldKey) => defaultTimeZone({ user, fieldKey, dispatch }) };
  const occurrenceOption = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE_OPTION, user.values);
  const flow = getValue(STORE_KEYS.UI_SCHEDULE_WORKFLOW, user.values);
  const fieldConfigMap = {
    [STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE]: occurrenceText,
    [STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE_OPTION]: occurrenceSelect,
    [STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_DAY]: powerOffAtDay,
    [STORE_KEYS.UI_SCHEDULE_TIME_ZONE]: timeZoneField,
  };
  useEffect(() => {
    const defaultTime = new Date();
    dispatch(getScheduleDaysLater());
    dispatch(getTimeZones());
    if (flow !== STATIC_KEYS.EDIT) {
      dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_DAY, 'sameDay'));
      dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE, 1));
      dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_MONTH, 1));
      dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_WEEK, ['Sunday']));
      dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_ON_TIME, defaultTime));
      dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_TIME, defaultTime));
    }
  }, []);

  const onCloseClick = () => {
    history.push(NODE_UPDATE_SCHEDULER);
    dispatch(setSelectedCreateScheduledNodes([]));
    dispatch(clearValues());
  };

  const onCreate = () => {
    const ids = Object.keys(selectedCreateScheduledNodes).map(Number);
    const occurrenceOptions = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE_OPTION, user.values);
    const repeat = parseInt(getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE, user.values) || '1', 10);
    const dayOfWeek = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_WEEK, user.values);
    const dayOfMonth = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_MONTH, user.values);
    const powerOffByDay = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_DAY, user.values);
    const powerOnTime = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_ON_TIME, user.values);
    const powerOffTime = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_TIME, user.values);

    let type;
    if (occurrenceOptions === STATIC_KEYS.DAY) type = 'Days';
    else if (occurrenceOptions === STATIC_KEYS.WEEK) type = 'Week';
    else type = 'Month';
    if (occurrenceOptions === STATIC_KEYS.MONTH) {
      fieldConfigMap[STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_MONTH] = dayOfMonthText;
    }
    if (validateConfigureShedule(user, dispatch, fieldConfigMap)) {
      if ((powerOnTime === null || powerOnTime === '') || (powerOffTime === null || powerOffTime === '')) {
        dispatch(addMessage('Invalid power on or power off time value', MESSAGE_TYPES.ERROR));
        return;
      }
      const powerOnCron = convertScheduleToCron({ type, repeat, dayOfWeek, dayOfMonth, time: formatTime(powerOnTime) });
      const { powerOffDayOfWeek, powerOffDayOfMonth, powerOffRepeat, errStr } = getPowerOffDayInterval({ type, repeat, dayOfWeek, dayOfMonth, powerOffByDay });
      if (errStr !== '') {
        dispatch(addMessage(errStr, MESSAGE_TYPES.ERROR));
        return;
      }
      const powerOffCron = convertScheduleToCron({ type, repeat: powerOffRepeat, dayOfWeek: powerOffDayOfWeek, dayOfMonth: powerOffDayOfMonth, time: formatTime(powerOffTime) });
      const powerOnCronSchedule = `* ${powerOnCron}`;
      const powerOffCronSchedule = `* ${powerOffCron}`;
      const selectedZone = getValue(STORE_KEYS.UI_SCHEDULE_TIME_ZONE, user.values);
      const powerOffDays = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_DAY, user.values);
      let timeZone = '';
      if (selectedZone) {
        timeZone = selectedZone.value;
      }
      const payload = {
        nodeType: NODE_TYPES.PrepNode,
        powerOnCronSchedule,
        powerOffCronSchedule,
        timeZone,
        powerOffDays,
        cronType: occurrenceOptions,
        occurrence: repeat,
      };
      if (flow === STATIC_KEYS.EDIT) {
        const selectedScheduleKey = Object.keys(selectedScheduledNodes);
        const { uuid, nodeId } = selectedScheduledNodes[selectedScheduleKey];
        payload.nodeID = nodeId;
        dispatch(configureSchedule(payload, true, history, uuid));
      } else {
        payload.associatedNodeIDs = ids;
        dispatch(configureSchedule(payload, false, history));
      }
    }
  };

  const renderFooter = () => {
    const disable = Object.keys(selectedCreateScheduledNodes).length <= 0;
    return (
      <Row className="m-3 me-5">
        <Col sm={9} className="text-right">
          <button type="button" className="btn btn-secondary me-2" onClick={onCloseClick}>{t('Close')}</button>
          <button type="button" className="btn btn-success" onClick={onCreate} disabled={disable}>{`${flow === STATIC_KEYS.EDIT ? t('Reconfigure Schedule') : t('Create Schedule')}`}</button>
        </Col>
      </Row>
    );
  };

  const renderDays = () => {
    if (occurrenceOption === STATIC_KEYS.WEEK) {
      return (
        <Row className="ms-3 mb-3">
          <Col sm={3}><p>{t('day.of.week')}</p></Col>
          <Col sm={5} className="pl-4">
            <DaySelector user={user} dispatch={dispatch} options={days} fieldkey={STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_WEEK} />
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
            <DMFieldNumber dispatch={dispatch} fieldKey={STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_MONTH} field={dayOfMonthText} user={user} hideLabel />
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

  const renderAlternateWeeklySummary = ({ repeat, dayOfWeek, powerOn, powerOff }) => {
    const powerOffByDay = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_DAY, user.values);
    const day = Array.isArray(dayOfWeek) ? dayOfWeek[0] : dayOfWeek;
    const dayText = `every ${toOrdinal(repeat)} week on ${day}`;
    const powerOnText = `Power on ${dayText} at ${formatTime(powerOn)}`;
    const offTimeStr = formatTime(powerOff);
    const offset = parseInt(powerOffByDay, 10);
    let powerOffText = '';
    if (powerOffByDay === 'sameDay' || Number.isNaN(offset)) {
      powerOffText = `Power off at ${offTimeStr} on the same day`;
    } else {
      powerOffText = `Power off on ${offset} day${offset > 1 ? 's' : ''} later at ${offTimeStr}`;
    }
    return (
      <div className="ml-3">
        <p>{t('schedule.summarry')}</p>
        <ul className="text-warning mb-1">
          <li>{powerOnText}</li>
          <li>{powerOffText}</li>
        </ul>
        <p className="ml-3 ">
          <i className="fas fa-exclamation-triangle icon__warning padding-right-7" aria-hidden="true" />
          <span className="text-warning ">
            {t('warning.system.schedule.create')}
          </span>
        </p>
      </div>
    );
  };

  const renderSummary = () => {
    const repeat = parseInt(getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE, user.values) || 1, 10);
    const occurrenceOptions = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE_OPTION, user.values);
    const dayOfWeek = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_WEEK, user.values); // Can be array for multiple
    const dayOfMonth = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_DAY_OF_MONTH, user.values) || 1; // reuse if same key
    const powerOn = new Date(getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_ON_TIME, user.values));
    const powerOff = new Date(getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_TIME, user.values));
    const powerOffByDay = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_DAY, user.values);

    if (occurrenceOptions === STATIC_KEYS.WEEK && repeat > 1) {
      return renderAlternateWeeklySummary({ repeat, dayOfWeek, powerOn, powerOff, t });
    }

    const summary = getScheduleSummary({
      occurrenceOptions,
      repeat,
      dayOfWeek,
      dayOfMonth,
      powerOnTime: powerOn,
      powerOffTime: powerOff,
      powerOffByDay,
      dispatch,
    });

    return (
      <div className="ms-3">
        <p>{t('schedule.summarry')}</p>
        <ul className="text-warning mb-1">
          <li>{summary.powerOnText}</li>
          <li>{summary.powerOffText}</li>
        </ul>
        <p className="ms-3 ">
          <i className="fas fa-exclamation-triangle icon__warning padding-right-7" aria-hidden="true" />
          <snap className="text-warning ">
            {t('warning.system.schedule.create')}
          </snap>
        </p>
      </div>
    );
  };

  return (
    <>
      <Container fluid>
        <Card>
          <CardBody style={{ minHeight: '100vh' }}>
            <DMBreadCrumb links={[{ label: 'node.system.update', link: NODE_UPDATE_SCHEDULER }, { label: `${flow === 'edit' ? 'Reconfigure' : 'Create'}`, link: '#' }]} />
            <Row className="ms-3 mb-2">
              <Col sm={3} className="mt-3"><p>{t('select.prepnode.schedule')}</p></Col>
              <SimpleBar style={{ maxHeight: '260px', width: '70%' }}>
                <Col sm={8}>
                  <DMTable
                    columns={TABLE_NODE_SCHEDULER}
                    data={flow === STATIC_KEYS.EDIT ? reconfigureData : data}
                    primaryKey="id"
                    isSelectable={flow !== 'edit'}
                    dispatch={dispatch}
                    onSelect={handleCreateNodeScheduleSelection}
                    selectedData={selectedCreateScheduledNodes}
                  />
                </Col>
              </SimpleBar>
            </Row>
            <div className="ms-4">
              <p>{t('sys.update.schedule')}</p>
              <Row className="ms-3 mb-2">
                <Col sm={3} className="mt-1"><p>{t('repeat.occurence')}</p></Col>
                <Col sm={3}>
                  <DMFieldNumber dispatch={dispatch} fieldKey={STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE} field={occurrenceText} user={user} hideLabel />
                </Col>
                <Col sm={2}>
                  <DMFieldSelect dispatch={dispatch} fieldKey={STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE_OPTION} field={occurrenceSelect} user={user} hideLabel />
                </Col>
                <Col sm={1} className="pb-3">
                  <DMToolTip tooltip={t('shedule.day.in.week')} />
                </Col>
              </Row>
              {renderDays()}
              <Row className="ms-3 mt-2 mb-2">
                <Col sm={3}><p>{t('power.on.at')}</p></Col>
                <Col sm={3} className="pr-5">
                  <DMTimePicker dispatch={dispatch} fieldKey={STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_ON_TIME} field={powerOnTimeField} user={user} hideLabel />
                </Col>
                <Col sm={2} />
                <Col sm={1} className="pb-3">
                  <DMToolTip tooltip={t('shedule.power.on.time')} />
                </Col>
              </Row>
              <Row className="ms-3 mb-2">
                <Col sm={3} className="mt-1"><p>{t('power.off.at')}</p></Col>
                <Col sm={2}>
                  <DMFieldSelect dispatch={dispatch} fieldKey={STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_DAY} field={powerOffAtDay} user={user} hideLabel />
                </Col>
                <Col sm={1} className="pt-2">{t('At')}</Col>
                <Col sm={2}>
                  <DMTimePicker dispatch={dispatch} fieldKey={STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_POWER_OFF_TIME} field={powerOffTimeField} user={user} hideLabel />
                </Col>
                <Col sm={1} className="pb-3">
                  <DMToolTip tooltip={t('shedule.power.off.time')} />
                </Col>
              </Row>
              <Row className="ms-3 mb-2">
                <Col sm={3} className="mt-1"><p>{t('schedule.time.zone')}</p></Col>
                <Col sm={3}>
                  <DMSearchSelect dispatch={dispatch} fieldKey={STORE_KEYS.UI_SCHEDULE_TIME_ZONE} field={timeZoneField} user={user} hideLabel />
                </Col>
                <Col sm={2} />
                <Col sm={1} className="pb-3">
                  <DMToolTip tooltip={t('time.zone.info')} />
                </Col>
              </Row>
            </div>
            {renderFooter()}
            {renderSummary()}
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

function mapStateToProps(state) {
  const { settings, user } = state;
  return { settings, user };
}
export default connect(mapStateToProps)(withTranslation()(NodeUpdateScheduleCreate));
