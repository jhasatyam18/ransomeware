import React, { Component } from 'react';
import { Label } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import DMTable from '../Table/DMTable';
import { TABLE_PROTECT_VM_VMWARE } from '../../constants/TableConstants';
import { handleProtectVMSeletion } from '../../store/actions/SiteActions';
import { getValue } from '../../utils/InputUtils';

class DRPlanProtectVMStep extends Component {
  render() {
    const { dispatch, user, t } = this.props;
    const { values } = user;
    const data = getValue('ui.site.vms', values);
    let selectedVMs = getValue('ui.site.seletedVMs', values);
    if (!selectedVMs) {
      selectedVMs = {};
    }
    return (
      <>
        <br />
        <Label>{t('Select Virtual Machine for protection')}</Label>
        <DMTable
          dispatch={dispatch}
          columns={TABLE_PROTECT_VM_VMWARE}
          data={data}
          isSelectable
          onSelect={handleProtectVMSeletion}
          selectedData={selectedVMs}
          primaryKey="moref"
        />
      </>
    );
  }
}

export default (withTranslation()(DRPlanProtectVMStep));
