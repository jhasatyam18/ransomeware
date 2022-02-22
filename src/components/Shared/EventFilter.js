import React, { useState } from 'react';
import { Input } from 'reactstrap';
import { filterDataByType } from '../../store/actions/AlertActions';
import { EVENT_LEVELS } from '../../constants/EventConstant';

function EventFilter(props) {
  const [value, setValue] = useState(0);
  function handleChange(e) {
    const { dispatch, data, action } = props;
    setValue(e.target.value);
    dispatch(filterDataByType(data, e.target.value, action));
  }

  return (
    <Input type="select" id="eventFilter" onSelect={handleChange} className="form-control form-control-sm custom-select" onChange={handleChange} value={value}>
      <option key="emptyKey" value={EVENT_LEVELS.ALL}>ALL</option>
      <option key="infoEvent" value={EVENT_LEVELS.INFO}> INFO </option>
      <option key="warningEvent" value={EVENT_LEVELS.WARNING}> WARNING </option>
      <option key="errorEvent" value={EVENT_LEVELS.ERROR}> ERROR </option>
      <option key="criticalEvent" value={EVENT_LEVELS.CRITICAL}> CRITICAL </option>
    </Input>
  );
}

export default EventFilter;
