import React, { Component } from 'react';
import { CardBody, Form } from 'reactstrap';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import { getValue } from '../../utils/InputUtils';
import DMField from '../Shared/DMField';

class WizardStep extends Component {
  render() {
    const { dispatch, user, fields } = this.props;
    const { values } = user;
    const recoverySite = getValue('ui.values.recoveryPlatform', values) || '';
    if (!fields && fields.length <= 0) {
      return null;
    }
    return (
      <>
        <CardBody className="modal-card-body">
          <Form>
            {
              fields.map((field) => (recoverySite === PLATFORM_TYPES.VMware && field === 'drplan.enableReverse' ? null : <DMField key={`${field}-DMField-key`} dispatch={dispatch} user={user} fieldKey={field} />))
            }
          </Form>
        </CardBody>
      </>
    );
  }
}

export default WizardStep;
