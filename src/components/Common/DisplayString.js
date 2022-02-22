import React from 'react';
import { Label } from 'reactstrap';

const DisplayString = (props) => {
  const { value } = props;
  function getString() {
    let ret = '-';
    if (typeof value === 'number') {
      ret = value;
    } else if (typeof value === 'string' && value !== '') {
      ret = `${value}`;
    }
    return ret;
  }
  const displayValue = getString();
  return (
    <Label>
      {displayValue}
    </Label>
  );
};
export default DisplayString;
