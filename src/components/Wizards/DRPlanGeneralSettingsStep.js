import React, { Component } from 'react';
import { CardBody, Form } from 'reactstrap';
import { DRPLAN_GENERAL_SETTINGS_STEP_FIELDS } from '../../constants/WizardConstants';
import DMField from '../Shared/DMField';

class DRPlanGeneralSettingsStep extends Component {
  render() {
    const { dispatch, user } = this.props;
    const fields = DRPLAN_GENERAL_SETTINGS_STEP_FIELDS;
    return (
      <>
        <CardBody className="modal-card-body">
          <Form>
            {
              fields.map((field) => (<DMField dispatch={dispatch} user={user} fieldKey={field} />))
            }
          </Form>
        </CardBody>
      </>
    );
  }
}

export default DRPlanGeneralSettingsStep;
