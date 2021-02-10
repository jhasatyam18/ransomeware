import React, { Component } from 'react';
import { CardBody, Form } from 'reactstrap';
import DMField from '../Shared/DMField';
import { RECOVERY_GENERAL_STEP_FIELDS } from '../../constants/WizardConstants';

class RecoveryGeneralStep extends Component {
  render() {
    const { dispatch, user } = this.props;
    const fields = RECOVERY_GENERAL_STEP_FIELDS;
    return (
      <>
        <CardBody className="modal-card-body">
          <Form>
            {
              fields.map((field) => (<DMField dispatch={dispatch} user={user} fieldKey={field} key={`RecoveryGeneralStep-${field}`} />))
            }
          </Form>
        </CardBody>
      </>
    );
  }
}

export default RecoveryGeneralStep;
