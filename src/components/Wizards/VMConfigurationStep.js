import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import DMAccordion from '../Shared/DMAccordion';
import { createVMConfigStackObject, getValue } from '../../utils/InputUtils';
import RecoveryStatusItemRenderer from '../Table/ItemRenderers/RecoveryStatusItemRenderer';
import { RECOVERY_STATUS } from '../../constants/InputConstants';

class VMConfigurationStep extends Component {
  renderNonEditableVM(vm) {
    return (
      <div key={`dm-accordion-${vm.moref}`}>
        <Card className="margin-bottom-10">
          <CardHeader>
            <Row>
              <Col sm={6}>
                <a href="#" onClick={this.toggle}>
                  {vm.name}
                </a>
              </Col>
              <Col sm={6} className="d-flex flex-row-reverse">
                <RecoveryStatusItemRenderer data={vm} />
              </Col>
            </Row>
          </CardHeader>
        </Card>
      </div>
    );
  }

  renderVMConfig(vm, index) {
    const { dispatch, user } = this.props;
    if (vm.isDeleted || vm.isRemovedFromPlan || vm.recoveryStatus === RECOVERY_STATUS.MIGRATED
      || vm.recoveryStatus === RECOVERY_STATUS.RECOVERED) {
      return this.renderNonEditableVM(vm);
    }
    const config = createVMConfigStackObject(vm, user);
    return (
      <DMAccordion title={vm.name} config={config} dispatch={dispatch} user={user} key={`accordion-vm-config-${vm.name}`} openByDefault={index === 0 ? 'true' : false} />
    );
  }

  renderNodes() {
    const { user } = this.props;
    const { values } = user;
    const selectedVMs = getValue('ui.site.seletedVMs', values);
    return Object.keys(selectedVMs).map((key, index) => (
      this.renderVMConfig(selectedVMs[key], index)
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
