import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMAccordion from '../../Shared/DMAccordion';
import { createVMConfigStackObject, getValue } from '../../../utils/InputUtils';
import { STATIC_KEYS } from '../../../constants/InputConstants';

function VMConfigure(props) {
  const { dispatch, user } = props;
  const { values } = user;
  const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);

  if (Object.keys(selectedVMs).length === 0) {
    return null;
  }
  const renderConfig = (vm, index) => {
    const config = createVMConfigStackObject(vm, user);
    return (
      <DMAccordion title={vm.name} config={config} dispatch={dispatch} user={user} key={`accordion-vm-config-${vm.name}`} openByDefault={index === 0 ? 'true' : false} />
    );
  };

  return Object.keys(selectedVMs).map((key, index) => (
    renderConfig(selectedVMs[key], index)
  ));
}

function mapStateToProps(state) {
  const { dashboard } = state;
  return { dashboard };
}
export default connect(mapStateToProps)(withTranslation()(VMConfigure));
