import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Col, Input, Row } from 'reactstrap';
import { valueChange } from '../../store/actions';
import { buildRangeOptions, getValue } from '../../utils/InputUtils';

function ReplicationInterval(props) {
  // props
  const { dispatch, fieldKey, user } = props;
  // states
  const [days, setDays] = useState(-1);
  const [hours, setHours] = useState(-1);
  const [min, setMin] = useState(-1);
  useEffect(() => {
    const { values } = user;
    // get fieldKey value from redux
    let interval = getValue(fieldKey, values);
    if (typeof interval !== 'undefined' && interval > 0) {
      // extract days from interval
      if (interval >= 1440) {
        const d = Math.floor((interval / 1440));
        setDays(d);
        while (interval >= 1440) {
          interval -= 1440;
        }
      }
      if (interval >= 60) {
        const h = Math.floor(interval / 60);
        setHours(h);
        while (interval >= 60) {
          interval -= 60;
        }
      }
      if (interval < 60) {
        setMin(interval);
      }
    }
  }, []);

  function onChange(value, unit) {
    let interval = 0;
    if (days > 0 || (unit === 'd')) {
      interval = (unit === 'd' ? (value * 1440) : (days * 1440));
    }
    if (hours > 0 || (unit === 'h')) {
      interval += (unit === 'h' ? (value * 60) : (hours * 60));
    }
    if (min > 0 || (unit === 'm')) {
      interval += (unit === 'm' ? Number(value) : Number(min));
    }
    dispatch(valueChange(fieldKey, interval));
  }

  function handleDaysSelect(event) {
    setDays(event.target.value);
    onChange(event.target.value, 'd');
  }
  function handleHourSelect(event) {
    setHours(event.target.value);
    onChange(event.target.value, 'h');
  }
  function handleMinSelect(event) {
    setMin(event.target.value);
    onChange(event.target.value, 'm');
  }

  function renderOptions(options, unit) {
    return options.map((op) => {
      const { value, label } = op;
      return (
        <option key={`${label}-${value}`} value={value}>
          {' '}
          {`${label} ${value > 1 ? `${unit}s` : unit}`}
          {' '}
        </option>
      );
    });
  }

  return (
    <>
      <Row className="padding-bottom-20">
        <Col sm={4}>
          Replication Interval
        </Col>
        <Col sm={8}>
          <Row>
            <Col sm={4}>
              <Input type="select" className="form-control form-control-sm custom-select" onChange={handleDaysSelect} value={days}>
                <option key="replication-days" value="0">
                  Days
                </option>
                {renderOptions(buildRangeOptions(1, 30, ''), 'Day')}
              </Input>
            </Col>
            <Col sm={4}>
              <Input type="select" className="form-control form-control-sm custom-select" onChange={handleHourSelect} value={hours}>
                <option key="replication-hours" value="0">
                  Hours
                </option>
                {renderOptions(buildRangeOptions(0, 23, ''), 'Hour')}
              </Input>
            </Col>
            <Col sm={4}>
              <Input type="select" className="form-control form-control-sm custom-select" onChange={handleMinSelect} value={min}>
                <option key="replication-minutes" value="0">
                  Minutes
                </option>
                {renderOptions(buildRangeOptions(1, 59, ''), 'Minute')}
              </Input>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ReplicationInterval));
