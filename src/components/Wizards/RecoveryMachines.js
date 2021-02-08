import React, { Component } from 'react';
import { Label } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { TABLE_RECOVERY_VMS } from '../../constants/TableConstants';
import { handleProtectVMSeletion, handleSelectAllRecoveryVMs } from '../../store/actions/SiteActions';
import { getValue } from '../../utils/InputUtils';

class RecoveryMachines extends Component {
  render() {
    const { dispatch, user } = this.props;
    const { values } = user;
    const data = getValue('ui.recovery.vms', values);
    let selectedVMs = getValue('ui.site.seletedVMs', values);
    if (!selectedVMs) {
      selectedVMs = {};
    }
    return (
      <>
        <br />
        <Label>Select Virtual Machine for recovery</Label>
        <DMTable
          dispatch={dispatch}
          columns={TABLE_RECOVERY_VMS}
          data={data}
          isSelectable
          onSelect={handleProtectVMSeletion}
          selectedData={selectedVMs}
          primaryKey="moref"
          name="recoveryvms"
          onSelectAll={handleSelectAllRecoveryVMs}
          user={user}
        />
      </>
    );
  }
}

export default RecoveryMachines;
