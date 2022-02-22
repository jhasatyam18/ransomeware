import React, { Component } from 'react';
import { CardBody, Form } from 'reactstrap';
import DMField from '../Shared/DMField';

class WizardStep extends Component {
  render() {
    const { dispatch, user, fields } = this.props;
    if (!fields && fields.length <= 0) {
      return null;
    }
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

export default WizardStep;
