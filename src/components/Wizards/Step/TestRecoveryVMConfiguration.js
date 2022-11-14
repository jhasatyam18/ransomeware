import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Card, CardBody } from 'reactstrap';
import { UI_WORKFLOW } from '../../../constants/InputConstants';
import { NOTE_TEXT } from '../../../constants/DMNoteConstant';
import DMNote from '../../Common/DMNote';
import { getValue } from '../../../utils/InputUtils';
import DMAccordion from '../../Shared/DMAccordion';
import { createVMTestRecoveryConfig } from '../../../utils/RecoveryUtils';

function TestRecoveryVMConfiguration(props) {
  const { user } = props;
  const { values } = user;
  const workFlow = getValue('ui.workflow', values);
  const renderVMConfig = (vm, index) => {
    const { dispatch } = props;
    const config = createVMTestRecoveryConfig(vm, user, dispatch);
    return (
      <DMAccordion title={vm.name} config={config} dispatch={dispatch} user={user} key={`accordion-vm-config-${vm.name}`} openByDefault={index === 0 ? 'true' : false} />
    );
  };

  const renderNodes = () => {
    const selectedVMs = getValue('ui.site.seletedVMs', values);
    return Object.keys(selectedVMs).map((key, index) => (
      renderVMConfig(selectedVMs[key], index)
    ));
  };

  const renderNote = () => <DMNote title="Info" info="test.recovery.note" color={NOTE_TEXT.INFO} open />;
  return (
    <Card>
      <CardBody>
        {workFlow === UI_WORKFLOW.TEST_RECOVERY ? renderNote() : null}
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
