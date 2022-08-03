import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Card, CardBody } from 'reactstrap';
import { getValue } from '../../../utils/InputUtils';
import DMAccordion from '../../Shared/DMAccordion';
import { createVMTestRecoveryConfig } from '../../../utils/RecoveryUtils';

function TestRecoveryVMConfiguration(props) {
  const renderVMConfig = (vm, index) => {
    const { dispatch, user } = props;
    const config = createVMTestRecoveryConfig(vm, user, dispatch);
    return (
      <DMAccordion title={vm.name} config={config} dispatch={dispatch} user={user} key={`accordion-vm-config-${vm.name}`} openByDefault={index === 0 ? 'true' : false} />
    );
  };

  const renderNodes = () => {
    const { user } = props;
    const { values } = user;
    const selectedVMs = getValue('ui.site.seletedVMs', values);
    return Object.keys(selectedVMs).map((key, index) => (
      renderVMConfig(selectedVMs[key], index)
    ));
  };

  const renderNote = () => {
    const { dispatch, user } = props;
    const config = { data: [{
      hasChildren: false,
      title: 'Configurtion',
      info: 'test.recovery.note',
    }] };
    return <DMAccordion title="Note" config={config} dispatch={dispatch} user={user} />;
  };
  return (
    <Card>
      <CardBody>
        {renderNote()}
        {renderNodes()}
      </CardBody>
    </Card>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(TestRecoveryVMConfiguration));
