import React from 'react';
import { Label, Container } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import DMTable from '../Table/DMTable';
import { getValue } from '../../utils/InputUtils';
import { TABLE_REVERSE_VM } from '../../constants/TableConstants';

function ReverseVMStep(props) {
  const { dispatch, user, t } = props;
  const { values } = user;
  const planData = getValue('ui.reverse.drPlan', values);
  let updateVMs;
  if (planData !== '') {
    const { protectedEntities, isDifferential } = planData;
    const { virtualMachines } = protectedEntities;
    updateVMs = virtualMachines.map((el) => ({ ...el, replicationType: isDifferential ? 'Differential' : 'Full' }));
  }
  const columns = TABLE_REVERSE_VM.filter((col) => col.label !== 'Replication Type' && col.label !== 'description');

  return (
    <Container fluid className="padding-10">
      <Label className="ml-3 pl-1">{t('Virtual Machine')}</Label>
      <SimpleBar>
        <DMTable
          dispatch={dispatch}
          columns={columns}
          data={updateVMs}
          primaryKey="moref"
        />
      </SimpleBar>
    </Container>
  );
}

export default (withTranslation()(ReverseVMStep));
