import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CardBody, Form } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { FIELDS } from '../../constants/FieldsConstant';
import { configureEmail } from '../../store/actions/EmailActions';
import { closeModal } from '../../store/actions/ModalActions';
import { getFormPayload } from '../../utils/PayloadUtil';
import { validateForm } from '../../utils/validationUtils';
import DMField from '../Shared/DMField';

class ModalEmailConfiguration extends Component {
  constructor() {
    super();
    this.onClose = this.onClose.bind(this);
    this.onConfigureEmail = this.onConfigureEmail.bind(this);
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  onConfigureEmail() {
    const { user, dispatch, options } = this.props;
    const { isUpdate, id } = options;
    if (validateForm('emailConfiguration.', user, dispatch)) {
      const payload = getFormPayload('emailConfiguration.', user);
      if (isUpdate) {
        dispatch(configureEmail({ ...payload.emailConfiguration, ID: id }));
      } else {
        dispatch(configureEmail({ ...payload.emailConfiguration }));
      }
    }
  }

  renderFooter() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
        <button type="button" className="btn btn-success" onClick={this.onConfigureEmail}> Configure </button>
      </div>
    );
  }

  renderForm() {
    const { user, dispatch } = this.props;
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf('emailConfiguration.') !== -1);
    const renderFields = [];
    fields.forEach((field) => {
      renderFields.push((<DMField dispatch={dispatch} user={user} fieldKey={field} key={`node-${field}`} />));
    });
    return (
      <CardBody className="modal-card-body">
        <Form>
          {
            renderFields
          }
        </Form>
      </CardBody>
    );
  }

  render() {
    return (
      <>
        <div className="modal-body noPadding">
          <SimpleBar style={{ maxHeight: '400px' }}>
            {this.renderForm()}
          </SimpleBar>
        </div>
        {this.renderFooter()}
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ModalEmailConfiguration));
