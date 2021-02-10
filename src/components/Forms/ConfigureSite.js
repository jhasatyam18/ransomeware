import React, { Component } from 'react';
import { Form, CardBody } from 'reactstrap';
import DMField from '../Shared/DMField';
import { FIELDS } from '../../constants/FieldsConstant';

class ConfigureSite extends Component {
  render() {
    const { dispatch, user } = this.props;
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf('configureSite') !== -1);
    return (
      <>
        <CardBody className="modal-card-body">
          <Form>
            {
              fields.map((field) => (<DMField dispatch={dispatch} user={user} fieldKey={field} key={`configureSite-${field}`} />))
            }
          </Form>
        </CardBody>
      </>
    );
  }
}

export default ConfigureSite;
