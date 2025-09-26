import React from 'react';
import SimpleBar from 'simplebar-react';

const ReverseDisabledVmWarningModal = ({ options }) => {
  const { vms } = options;
  return (
    <div className="text-warning ms-2">
      <p>Replication is disabled for the following workloads :</p>
      <SimpleBar style={{ maxHeight: '40vh' }}>
        <ul>
          {vms.map((el) => <li>{el.name}</li>)}
        </ul>
      </SimpleBar>
      <p>If a reverse operation is initiated, the replication status will be updated to enabled</p>
    </div>
  );
};

export default ReverseDisabledVmWarningModal;
