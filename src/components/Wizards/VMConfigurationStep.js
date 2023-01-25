import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { valueChange } from '../../store/actions';
import DMAccordion from '../Shared/DMAccordion';
import RecoveryStatusItemRenderer from '../Table/ItemRenderers/RecoveryStatusItemRenderer';
import { createVMConfigStackObject, getValue } from '../../utils/InputUtils';
import { isRemovedOrRecoveredVM } from '../../utils/validationUtils';

class VMConfigurationStep extends Component {
  constructor() {
    super();
    this.removeEntityFromPplan = this.removeEntityFromPplan.bind(this);
  }

  removeEntityFromPplan(vmmoref) {
    const { user, dispatch } = this.props;
    const { values } = user;
    const selectedVMs = getValue('ui.site.seletedVMs', values);
    Object.keys(selectedVMs).forEach((slvms) => {
      if (slvms === vmmoref) {
        delete selectedVMs[slvms];
      }
    });
    dispatch(valueChange('ui.site.selectedVMs', selectedVMs));
  }

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
                <Row>
                  <Col sm={9}>
                    {' '}
                    <RecoveryStatusItemRenderer data={vm} />
                  </Col>
                  <Col sm={2}>
                    <a href="#" style={{ color: 'white' }} onClick={() => this.removeEntityFromPplan(vm.moref)}>
                      <FontAwesomeIcon size="lg" icon={faCircleXmark} />
                    </a>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardHeader>
        </Card>
      </div>
    );
  }

  renderVMConfig(vm, index) {
    const { dispatch, user } = this.props;
    if (isRemovedOrRecoveredVM(vm)) {
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
