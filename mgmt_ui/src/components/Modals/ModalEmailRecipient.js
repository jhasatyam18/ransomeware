import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { CardBody, Form } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { FIELDS } from '../../constants/FieldsConstant';
import { configureRecipient } from '../../store/actions/EmailActions';
import { closeModal } from '../../store/actions/ModalActions';
import { getFormPayload } from '../../utils/PayloadUtil';
import { validateForm } from '../../utils/validationUtils';
import DMField from '../Shared/DMField';

class ModalEmailRecipient extends Component {
  constructor() {
    super();
    this.onClose = this.onClose.bind(this);
    this.onConfigureRecipient = this.onConfigureRecipient.bind(this);
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  onConfigureRecipient() {
    const { user, dispatch, options } = this.props;
    const { isUpdate, id } = options;
    if (validateForm('emailRecipient.', user, dispatch)) {
      const payload = getFormPayload('emailRecipient.', user);
      const { emailRecipient } = payload;
      if (isUpdate) {
        emailRecipient.ID = id;
      }
      emailRecipient.subscribedEvents = (typeof emailRecipient.subscribedEvents !== 'string' ? emailRecipient.subscribedEvents.join(',') : emailRecipient.subscribedEvents);
      dispatch(configureRecipient({ ...payload.emailRecipient }));
    }
  }

  renderFooter() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
        <button type="button" className="btn btn-success" onClick={this.onConfigureRecipient}> Configure </button>
      </div>
    );
  }

  renderForm() {
    const { user, dispatch } = this.props;
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf('emailRecipient.') !== -1);
    const renderFields = [];
    fields.forEach((field) => {
      renderFields.push((<DMField dispatch={dispatch} user={user} fieldKey={field} key={`recipient-${field}`} />));
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
        <div className="modal-body">
          <SimpleBar className="max-h-400">
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
export default connect(mapStateToProps)(withTranslation()(ModalEmailRecipient));
