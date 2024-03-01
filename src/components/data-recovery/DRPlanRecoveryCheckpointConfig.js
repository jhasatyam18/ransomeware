import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Col, Container, Input, Label, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { TIME_CONSTANTS } from '../../constants/UserConstant';
import DMField from '../Shared/DMField';
import DMToolTip from '../Shared/DMToolTip';
import { getCheckpointTimeFromMinute } from '../../store/actions/checkpointActions';
import { removeErrorMessage, valueChange } from '../../store/actions';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { isEmpty, isEmptyNum } from '../../utils/validationUtils';
import { getRecoveryPointConfiguration, getReplicationInterval } from '../../utils/PayloadUtil';
import { convertMinIntoHrDayWeekMonthYear } from '../../utils/AppUtils';
import { getCheckpointDurationOption, getCheckRentaintionOption, getValue } from '../../utils/InputUtils';

function DRPlanRecoveryCheckpointConfig(props) {
  const [count, setCount] = useState(0);
  const [durationNum, setDurationNum] = useState(0);
  const [durationUnit, setdurationUnit] = useState('day');
  const [retainNum, setretainNum] = useState(0);
  const [retainUnit, setretainUnit] = useState('hour');
  const { dispatch, user, t } = props;
  const { values, errors } = user;
  const selectedVmForRecovery = getValue('ui.site.selectedVMs', values);
  const disableRecoveryCheckpointing = getValue(STORE_KEYS.UI_DISABLE_RECOVERY_CHECKPOINT, values) || false;
  const data = [];
  Object.keys(selectedVmForRecovery).forEach((el) => {
    data.push(selectedVmForRecovery[el]);
  });
  const isRecoveryCheckpointingEnable = getValue(STORE_KEYS.RECOVERY_CHECKPOINTING_ENABLED, values);
  const replicationInterval = getReplicationInterval(getValue(STATIC_KEYS.REPLICATION_INTERVAL_TYPE, values), getValue('drplan.replicationInterval', values));

  useEffect(() => {
    const snapshotCount = getValue(STORE_KEYS.RECOVERY_CHECKPOINT_COUNT, values) || 0;
    const durationNumber = getValue(STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_NUM, values) || 0;
    const retainNumber = getValue(STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER, values) || 0;
    const retainForUnit = getValue(STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER_UNIT, values) || TIME_CONSTANTS.HOUR;
    const durationunit = getValue(STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_UNIT, values) || TIME_CONSTANTS.DAY;
    dispatch(valueChange('recoveryPointConfiguration.duration', TIME_CONSTANTS.DAY));
    dispatch(valueChange('recoveryPointConfiguration.retainfor', TIME_CONSTANTS.HOUR));
    setDurationNum(parseInt(durationNumber, 10));
    setCount(parseInt(snapshotCount, 10));
    setretainNum(parseInt(retainNumber, 10));
    setretainUnit(retainForUnit || TIME_CONSTANTS.HOUR);
    setdurationUnit(durationunit || TIME_CONSTANTS.DAY);
  }, []);

  const renderOptions = (options) => options.map((op) => {
    const { value, label } = op;
    return (
      <option key={`${label}-${value}`} value={value}>
        {label}
      </option>
    );
  });

  const validateFields = (fieldKey, value) => {
    const validate = isEmpty({ value }) || isEmptyNum({ value });
    if (validate) {
      return false;
    }
    if (errors[fieldKey]) {
      dispatch(removeErrorMessage(fieldKey));
    }
    return true;
  };

  const handleNumChange = (e, fieldKey, func) => {
    let val = parseInt(`${e.target.value}`, 10);
    if (val === 0) {
      val = 1;
    }
    func(val);
    dispatch(valueChange(fieldKey, val));
  };

  const handleChangeSelectChange = (e, fieldKey, func) => {
    func(e.target.value);
    dispatch(valueChange(fieldKey, e.target.value));
  };

  const renderSummary = () => {
    if (count && durationNum && durationUnit && retainNum && retainUnit) {
      const { recoveryPointTimePeriod, recoveryPointCopies, isRecoveryCheckpointEnabled, recoveryPointRetentionTime } = getRecoveryPointConfiguration(user);
      const recoverySnapshot = (recoveryPointTimePeriod / recoveryPointCopies);
      const isCHeckpoiningPossible = recoverySnapshot % replicationInterval;
      const retaintion = `${retainNum} ${retainUnit}`;
      const checkpointCopyCreationTime = convertMinIntoHrDayWeekMonthYear(recoveryPointTimePeriod, recoveryPointCopies);
      let res = '';
      let className = '';
      if (isCHeckpoiningPossible === 0) {
        if (recoverySnapshot > recoveryPointRetentionTime) {
          className = 'card_note_warning';
          res = t('checkpoint.warn.retain.greterthan.interval', { recoveryPointCopies, durationNum, durationUnit, checkpointCopyCreationTime, retaintion });
        } else {
          res = t('checkpoint.info', { checkpointCopyCreationTime, retaintion });
        }
      } else {
        className = 'card_note_warning';
        const replIntervalObj = getCheckpointTimeFromMinute(replicationInterval);
        const str = t('checkpoint.warn.multiple.of.replication.interval', { recoveryPointCopies, durationNum, durationUnit, checkpointCopyCreationTime, time: replIntervalObj.time, unit: replIntervalObj.unit });
        res = str;
      }

      return (
        <>
          <div className="padding-top-15">
            <Label for="horizontal-firstname-Input">
              Configuration Summary :
            </Label>
            <p className={`${!isRecoveryCheckpointEnabled ? 'checkpoint_diable_summary' : className}`}>
              {res}
            </p>
          </div>
        </>
      );
    }
  };

  const enableCheckpointItem = () => (
    <Row className={`margin-top-5 ${disableRecoveryCheckpointing ? 'checkpoint_diable_summary' : ''}`}>
      <Col sm={4}>
        {t('title.enable.checkpointing')}
      </Col>
      <Col sm={6}>
        <DMField dispatch={dispatch} fieldKey="recoveryPointConfiguration.isRecoveryCheckpointEnabled" user={user} hideLabel disabled={disableRecoveryCheckpointing} />
      </Col>
    </Row>
  );

  const renderError = (hasError, fieldKey, msg) => {
    if (hasError) {
      return (
        <small className="form-text app_danger" htmlFor={fieldKey}>{msg}</small>
      );
    }
    return null;
  };

  const checkpointCountAndPeriodItem = () => {
    const countHasError = !!(errors && typeof errors[STORE_KEYS.RECOVERY_CHECKPOINT_COUNT] !== 'undefined');
    const durationHasError = !!(errors && typeof errors[STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_NUM] !== 'undefined');
    const durationUnitHasError = !!(errors && typeof errors[STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_UNIT] !== 'undefined');
    return (
      <>
        <Row className="margin-bottom-10 form-group">
          <Col sm={3} className="padding-top-6">
            {t('title.checkpoint.count')}
          </Col>
          <Col sm={2}>
            <Input
              type="number"
              className={`form-control ${!isRecoveryCheckpointingEnable ? 'checkpoint_diable_summary' : ''}`}
              id="recoveryPointConfiguration.count"
              disabled={!isRecoveryCheckpointingEnable}
              onChange={(e) => handleNumChange(e, STORE_KEYS.RECOVERY_CHECKPOINT_COUNT, setCount)}
              value={count}
              invalid={countHasError}
              onBlur={() => validateFields(STORE_KEYS.RECOVERY_CHECKPOINT_COUNT, count)}
            />
            {renderError(countHasError, STORE_KEYS.RECOVERY_CHECKPOINT_COUNT, 'Invalid')}
          </Col>
          <p className="padding-top-6">
            {t('title.checkpoint.every')}
          </p>
          <Col sm={2}>
            <Input
              type="number"
              invalid={durationHasError}
              id="recoveryPointConfiguration.duration.number"
              className={`form-control form-control-sm custom-select ${!isRecoveryCheckpointingEnable ? 'checkpoint_diable_summary' : ''}`}
              onChange={(e) => handleNumChange(e, STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_NUM, setDurationNum)}
              value={durationNum}
              disabled={!isRecoveryCheckpointingEnable}
              onBlur={() => validateFields(STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_NUM, durationNum)}
            />
            {renderError(durationHasError, STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_NUM, 'Invalid')}
          </Col>
          <Col sm={2}>
            <Input
              type="select"
              id="recoveryPointConfiguration.duration"
              className={`form-control form-control-sm custom-select ${!isRecoveryCheckpointingEnable ? 'checkpoint_diable_summary' : ''}`}
              onChange={(e) => handleChangeSelectChange(e, STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_UNIT, setdurationUnit)}
              value={durationUnit}
              disabled={!isRecoveryCheckpointingEnable}
              invalid={durationUnitHasError}
              onBlur={() => validateFields(STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_UNIT, durationUnit)}
            >
              {renderOptions(getCheckpointDurationOption(user, dispatch))}
            </Input>
            {renderError(durationUnitHasError, STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_UNIT, 'Invalid')}
          </Col>
          <span className="padding-left-10">
            <DMToolTip tooltip="info.checkpoint.duration" />
          </span>
        </Row>
      </>
    );
  };

  const checkpointRetaintionItem = () => {
    const retainCounthasError = !!(errors && typeof errors[STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER] !== 'undefined');
    const retainUnitHasError = !!(errors && typeof errors[STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER_UNIT] !== 'undefined');
    return (
      <>
        <Row>
          <Col sm={3}>
            {t('title.checkpoint.retain')}
          </Col>
          <Col sm={2}>
            <Input
              type="number"
              min={1}
              id="recoveryPointConfiguration.retain.number"
              className={`form-control form-control-sm custom-select ${!isRecoveryCheckpointingEnable ? 'checkpoint_diable_summary' : ''}`}
              onChange={(e) => handleNumChange(e, STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER, setretainNum)}
              value={retainNum}
              disabled={!isRecoveryCheckpointingEnable}
              invalid={retainCounthasError}
              onBlur={() => validateFields(STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER, retainNum)}
            />
            {renderError(retainCounthasError, STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER, 'Invalid')}
          </Col>
          <Col sm={2}>
            <Input
              type="select"
              id="recoveryPointConfiguration.retainfor"
              className={`form-control form-control-sm custom-select ${!isRecoveryCheckpointingEnable ? 'checkpoint_diable_summary' : ''}`}
              onChange={(e) => handleChangeSelectChange(e, STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER_UNIT, setretainUnit)}
              value={retainUnit}
              disabled={!isRecoveryCheckpointingEnable}
              invalid={retainUnitHasError}
              onBlur={() => validateFields(STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER_UNIT, retainUnit)}
            >
              {renderOptions(getCheckRentaintionOption(user, dispatch))}
            </Input>
            {renderError(retainUnitHasError, STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER_UNIT, 'Invalid')}
          </Col>
          <span className="padding-left-10">
            <DMToolTip tooltip="info.checkpoint.retention period" />
          </span>
        </Row>
      </>
    );
  };

  return (
    <>
      <Card>
        <CardBody>
          <Container>
            <CardTitle className="margin-bottom-20">{t('point.in.time.configuration')}</CardTitle>
            <p>{t('replication.interval.info', { replicationInterval })}</p>
            {disableRecoveryCheckpointing ? (
              <p className="card_note_warning">
                {t('checkpoint.disable.warning.text')}
              </p>
            ) : null}
            {enableCheckpointItem()}
            <div className={`${!isRecoveryCheckpointingEnable ? 'checkpoint_diable_summary' : null}`}>
              {checkpointCountAndPeriodItem()}
              {checkpointRetaintionItem()}
              {renderSummary()}
            </div>
          </Container>
        </CardBody>
      </Card>
    </>
  );
}

export default (withTranslation()(DRPlanRecoveryCheckpointConfig));
