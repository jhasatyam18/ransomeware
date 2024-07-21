import React from 'react';
import { withTranslation } from 'react-i18next';
import { Container, Label } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import DMTable from '../Table/DMTable';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { TABLE_REVERSE_VM } from '../../constants/TableConstants';
import { getValue } from '../../utils/InputUtils';

const ReverseVMReplInfo = (props) => {
  const { dispatch, t, user } = props;
  const { values } = user;
  const vms = [];
  const columns = TABLE_REVERSE_VM.filter((col) => col.label !== 'Storage' && col.label !== 'os');
  const drPlan = getValue('ui.reverse.drPlan', values);
  const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const failedEntitie = getValue(STATIC_KEYS.REVERSE_VALIDATE_FAILED_ENTITIE, values);
  if (failedEntitie && failedEntitie.length > 0) {
    failedEntitie.forEach((entity) => {
      const key = Object.keys(selectedVMs).find((el) => selectedVMs[el].moref === entity.failedEntity);
      if (key) {
        selectedVMs[key].replicationType = STATIC_KEYS.FULL;
        const vmIndex = drPlan.protectedEntities.VirtualMachines.findIndex(
          (vm) => vm.moref === entity.failedEntity,
        );

        if (vmIndex !== -1) {
          drPlan.protectedEntities.VirtualMachines[vmIndex].isDifferential = false;
        }
        selectedVMs[key].description = entity.failureMessage;
      }
    });
  }
  Object.keys(selectedVMs).forEach((el) => {
    if (typeof selectedVMs[el].replicationType === 'undefined') {
      selectedVMs[el].replicationType = STATIC_KEYS.DIFFERENTIAL;
    }
    if (typeof selectedVMs[el].description === 'undefined') {
      selectedVMs[el].description = '-';
    }
    vms.push({ ...selectedVMs[el] });
  });

  return (
    <Container fluid className="padding-10">
      <Label className="ml-3 pl-1">{t('Virtual Machine')}</Label>
      <SimpleBar>
        <DMTable
          dispatch={dispatch}
          columns={columns}
          data={vms}
          primaryKey="moref"
          name="reverseVM"
        />
      </SimpleBar>
    </Container>
  );
};

export default (withTranslation()(ReverseVMReplInfo));
