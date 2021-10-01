import React, { Component } from 'react';
import { Card, CardBody } from 'reactstrap';
import DMAccordion from '../Shared/DMAccordion';
import { createVMConfigStackObject, getValue } from '../../utils/InputUtils';

class VMConfigurationStep extends Component {
  renderVMConfig(vm) {
    const { dispatch, user } = this.props;
    const config = createVMConfigStackObject(vm, user);
    return (
      <DMAccordion title={vm.name} config={config} dispatch={dispatch} user={user} key={`accordion-vm-config-${vm.name}`} />
    );
  }

  renderNodes() {
    const { user } = this.props;
    const { values } = user;
    const selectedVMs = getValue('ui.site.seletedVMs', values);
    return Object.keys(selectedVMs).map((key) => (
      this.renderVMConfig(selectedVMs[key])
    ));
  }

  render() {
    return (
      <Card>
        <CardBody>
          {this.renderNodes()}
        </CardBody>
      </Card>
    );
  }
}

export default VMConfigurationStep;
