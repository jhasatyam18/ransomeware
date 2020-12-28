import React, { Component } from 'react';
import { Label } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { TABLE_PROTECT_VM_VMWARE } from '../../constants/TableConstants';
import { handleProtectVMSeletion } from '../../store/actions/SiteActions';
import { getValue } from '../../utils/InputUtils';

class DRPlanProtectVMStep extends Component {
  render() {
    const { dispatch, user } = this.props;
    const { values } = user;
    const data = getValue('ui.site.vms', values);
    let selectedVMs = getValue('ui.site.seletedVMs', values);
    if (!selectedVMs) {
      selectedVMs = {};
    }
    return (
      <>
        <br />
        <Label>Select Virtual Machine &apos s for disaser recovery</Label>
        <DMTable
          dispatch={dispatch}
          columns={TABLE_PROTECT_VM_VMWARE}
          data={data}
          isSelectable
          onSelect={handleProtectVMSeletion}
          selectedData={selectedVMs}
          primaryKey="Moref"
        />
      </>
    );
  }
}

export default DRPlanProtectVMStep;
