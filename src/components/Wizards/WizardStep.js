import React, { Component } from 'react';
import { Form } from 'reactstrap';
import DMField from '../Shared/DMField';

class WizardStep extends Component {
  render() {
    const { dispatch, user, fields } = this.props;
    if (!fields && fields.length <= 0) {
      return null;
    }
    return (
      <>
        <Form className="p-4">
          {
              fields.map((field) => (<DMField key={`${field}-DMField-key`} dispatch={dispatch} user={user} fieldKey={field} />))
            }
        </Form>
      </>
    );
  }
}

export default WizardStep;
