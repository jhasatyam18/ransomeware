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
import { getValue } from '../../utils/InputUtils';
import { EMAIL } from '../../constants/InputConstants';
import { clearValues } from '../../store/actions';

class ModalEmailConfiguration extends Component {
  constructor() {
    super();
    this.onClose = this.onClose.bind(this);
    this.onConfigureEmail = this.onConfigureEmail.bind(this);
    this.onSendTestEmail = this.onSendTestEmail.bind(this);
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(clearValues());
    dispatch(closeModal());
  }

  onConfigureEmail() {
    const { user, dispatch, options } = this.props;
    const { isUpdate, id } = options;
    if (validateForm('emailConfiguration.', user, dispatch)) {
      const payload = getFormPayload('emailConfiguration.', user);
      payload.emailConfiguration.insecureSkipVerify = !payload.emailConfiguration.insecureSkipVerify;
      // getFormPayload function also taking checkbox value and recipient email value but we don't need it in configure email, so removed it.
      delete payload.emailConfiguration.isValidate;
      delete payload.emailConfiguration.recipientEmail;
      if (isUpdate) {
        dispatch(configureEmail({ ...payload.emailConfiguration, ID: id }));
      } else {
        dispatch(configureEmail({ ...payload.emailConfiguration }));
      }
    }
  }

  onSendTestEmail() {
    const { user, dispatch } = this.props;
    if (validateForm('emailConfiguration.', user, dispatch)) {
      const payload = getFormPayload('emailConfiguration.', user);
      payload.emailConfiguration.insecureSkipVerify = !payload.emailConfiguration.insecureSkipVerify;
      // deleted test email checkbox value beacuse it is not needed in payload.
      delete payload.emailConfiguration.isValidate;
      dispatch(configureEmail({ ...payload.emailConfiguration }, true));
    }
  }

  renderFooter() {
    const { user, t } = this.props;
    const { values } = user;
    const isValidateEmail = getValue(EMAIL.RECIPIENT_ISVALIDATE, values);
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onClose}>
          {t('close')}
        </button>
        {!isValidateEmail
          ? (
            <button type="button" className="btn btn-success" onClick={this.onConfigureEmail}>
              {t('configure')}
            </button>
          )
          : (
            <button type="button" className="btn btn-success" onClick={this.onSendTestEmail}>
              {t('send.test.email')}
            </button>
          )}
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
export default connect(mapStateToProps)(withTranslation()(ModalEmailConfiguration));
