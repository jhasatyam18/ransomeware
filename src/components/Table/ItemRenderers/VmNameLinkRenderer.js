import React from 'react';
import { valueChange } from '../../../store/actions';
import { KEY_CONSTANTS } from '../../../constants/UserConstant';
import { changeReplicationJobType } from '../../../store/actions/JobActions';
import { REPLICATION_JOB_TYPE } from '../../../constants/InputConstants';

const VmNameLinkRenderer = ({ data, dispatch }) => {
  const { name, recoveryStatus } = data;
  const onClick = () => {
    dispatch(changeReplicationJobType(REPLICATION_JOB_TYPE.VM));
    dispatch(valueChange(KEY_CONSTANTS.UI_REPL_VM_NAME, name));
  };
  return (
    <>
      <span aria-hidden className="link_color cursor-pointer" onClick={() => onClick()}>
        {name}
      </span>
      {recoveryStatus ? <span style={{ display: 'block', fontSize: '10px' }} className="text-success mt-1">{`(${recoveryStatus})`}</span> : null}
    </>
  );
};

export default VmNameLinkRenderer;
