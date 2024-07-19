import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Label, Row } from 'reactstrap';
import DMToolTip from '../Shared/DMToolTip';
import { valueChange } from '../../store/actions';
import { getValue } from '../../utils/InputUtils';
import { STATIC_KEYS } from '../../constants/InputConstants';

const ReverseOptionRenderer = (props) => {
  const { field, t, fieldKey, dispatch, hideLabel, user } = props;
  const { values } = user;
  const { label, options, fieldInfo } = field;
  const val = getValue(fieldKey, values);
  const onChange = (v) => {
    dispatch(valueChange(fieldKey, v));
  };

  useEffect(() => {
    const type = getValue(fieldKey, values);
    const planEntityType = getValue(STATIC_KEYS.UI_REVERSE_RECOVERY_ENTITY, values);
    if (typeof type !== 'undefined' && type !== '') {
      dispatch(valueChange(fieldKey, type));
    } else {
      dispatch(valueChange(fieldKey, planEntityType));
    }
  }, []);
  return (
    <Row className="mb-4">
      {!hideLabel && <Col sm={4}>{label}</Col>}
      <Col sm={!hideLabel ? 7 : 10} className="pl-4">
        {options.length > 0 && options.map((el) => (
          <div className="form-check-inline pr-2">
            <input type="radio" id={fieldKey} className="form-check-input" name={fieldKey} value={el.value} checked={val === el.value} onChange={(e) => onChange(e.target.value)} />
            <Label className="form-check-label fs-30" htmlFor={fieldKey}>{el.label}</Label>
          </div>
        ))}
      </Col>
      <Col sm={1} className="pl-5"><DMToolTip tooltip={t(`${fieldInfo}`)} /></Col>
    </Row>
  );
};

export default (withTranslation()(ReverseOptionRenderer));
