import React from 'react';
import { Label } from 'reactstrap';

const CheckBox = (props) => {
  const { selected } = props;
  const text = selected ? 'Enabled' : 'Disabled';
  return (
    <Label>
      {text}
    </Label>
  );
};
export default CheckBox;
