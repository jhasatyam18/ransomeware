import React, { Component } from 'react';
import { CardBody, Form } from 'reactstrap';
import DMField from '../Shared/DMField';
import { MIGRATION_GENERAL_STEP_FIELDS } from '../../constants/WizardConstants';

class MigrationGeneralStep extends Component {
  render() {
    const { dispatch, user } = this.props;
    const fields = MIGRATION_GENERAL_STEP_FIELDS;
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

export default MigrationGeneralStep;
