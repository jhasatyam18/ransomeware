import React, { Component } from 'react';
import { CardBody, Form } from 'reactstrap';
import DMField from '../Shared/DMField';
import { REVERSE_GENERAL_STEP_FIELDS } from '../../constants/WizardConstants';

class ReverseGeneralStep extends Component {
  render() {
    const { dispatch, user } = this.props;
    const fields = REVERSE_GENERAL_STEP_FIELDS;
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

export default ReverseGeneralStep;
