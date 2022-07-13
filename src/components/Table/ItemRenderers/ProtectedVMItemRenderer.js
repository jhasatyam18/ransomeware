import React from 'react';
import { initReconfigureProtectedVM } from '../../../store/actions/DrPlanActions';
import { addMessage } from '../../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { isVMRecovered } from '../../../utils/validationUtils';

function ProtectedVMItemRenderer({ data, dispatch }) {
  if (!data || isVMRecovered(data)) {
    return '';
  }
  const onEditVM = () => {
    const { location } = window;
    const { pathname } = location;
    const pathArray = pathname.split('/');
    if (Number.isNaN(pathArray[pathArray.length - 1])) {
      dispatch(addMessage('Protection plan not identified for the virtual machine', MESSAGE_TYPES.ERROR));
      return;
    }
    dispatch(initReconfigureProtectedVM(pathArray[pathArray.length - 1], data.moref, null, null));
  };

  const renderEdit = () => (
    <a href="#" onClick={() => onEditVM()}>
      <i className="far fa-edit fa-lg" style={{ fontSize: '14px' }} />
    </a>
  );

  return (
    <div>
      &nbsp;
      &nbsp;
      {renderEdit()}
    </div>
  );
}

export default ProtectedVMItemRenderer;
