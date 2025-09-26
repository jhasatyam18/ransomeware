import React, { useEffect, useState } from 'react';
import { Badge, Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { faMinusCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FIELDS } from '../../constants/FieldsConstant';
import ActionButton from '../Common/ActionButton';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import DMFieldText from '../Shared/DMFieldText';
import DMToolTip from '../Shared/DMToolTip';
import { getValue } from '../../utils/InputUtils';
import { EMAIL_REGEX } from '../../constants/ValidationConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { valueChange } from '../../store/actions';

const ConfigureEmailStep = (props) => {
  const { user, dispatch, t } = props;
  const { values } = user;
  const recipientEmails = getValue(STORE_KEYS.UI_REPORT_SCHEDULER_EMAIL, values) || '';
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    if (recipientEmails) {
      const arr = recipientEmails
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean);
      setEmails(arr);
    }
  }, []);

  const updateReduxEmails = (updatedEmails) => {
    setEmails(updatedEmails);
    const emailString = updatedEmails.join(',');
    dispatch(valueChange(STORE_KEYS.UI_REPORT_SCHEDULER_EMAIL, emailString));
    dispatch(valueChange(STORE_KEYS.UI_REPORT_SCHEDULER_EMAIL_FIELD, ''));
  };

  const validateEmail = (email) => EMAIL_REGEX.test(email);

  const handleAddEmail = () => {
    const inputEmail = getValue(STORE_KEYS.UI_REPORT_SCHEDULER_EMAIL_FIELD, values)?.trim();
    if (!inputEmail) {
      dispatch(addMessage('Please enter an email address', MESSAGE_TYPES.ERROR));
      return;
    }
    if (!validateEmail(inputEmail)) {
      dispatch(addMessage('Please enter a valid email address', MESSAGE_TYPES.ERROR));
      return;
    }
    if (emails.includes(inputEmail)) {
      dispatch(addMessage('This email is already added', MESSAGE_TYPES.ERROR));
      return;
    }
    updateReduxEmails([...emails, inputEmail]);
  };

  const removeEmail = (emailToRemove) => {
    const updated = emails.filter((e) => e !== emailToRemove);
    updateReduxEmails(updated);
  };

  const renderFields = () => (
    <Row>
      <Col sm={6}>
        <DMFieldText dispatch={dispatch} fieldKey={STORE_KEYS.UI_REPORT_SCHEDULER_EMAIL_FIELD} field={FIELDS['schedule.report.email']} user={user} onEnter={handleAddEmail} />
      </Col>
      <Col sm={1}>
        <ActionButton label="Add" icon={faPlus} onClick={handleAddEmail} t={t} cssName="btn btn-secondary btn-sm mt-1" key="reportScheduleConfiguration" />
      </Col>
      <Col sm={1} className="pb-3">
        <DMToolTip tooltip={t('schedule.report.email.info')} />
      </Col>
    </Row>
  );

  return (
    <>
      <div style={{ paddingLeft: '1%' }}>{renderFields()}</div>
      <div className="mt-3">
        {emails.length === 0 ? (
          <div style={{ paddingLeft: '28%' }} className="py-4">
            <p className="text-sm">No recipients added yet</p>
          </div>
        ) : (
          <div style={{ width: 'auto', paddingLeft: '17%' }} className=" m-2">
            {emails.map((email, index) => (
              <Badge className="font-size-13 badge-soft-info p-2 m-1" color="info" pill key={`${index + 1}`}>
                <span className="font-medium">{email}</span>
                &nbsp;&nbsp;
                <FontAwesomeIcon icon={faMinusCircle} size="sm" onClick={() => removeEmail(email)} className="cursor-pointer" />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

function mapStateToProps(state) {
  const { settings, user } = state;
  return { settings, user };
}
export default connect(mapStateToProps)(withTranslation()(ConfigureEmailStep));
