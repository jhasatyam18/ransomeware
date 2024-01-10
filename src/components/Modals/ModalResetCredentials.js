import React, { useState } from 'react';
import SimpleBar from 'simplebar-react';
import { CardBody, Form } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { FIELDS } from '../../constants/FieldsConstant';
import DMField from '../Shared/DMField';
import { closeModal } from '../../store/actions/ModalActions';
import { getKeyStruct } from '../../utils/PayloadUtil';
import { API_USER_RESET } from '../../constants/ApiConstants';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { clearValues, hideApplicationLoader, showApplicationLoader } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { getCookie } from '../../utils/CookieUtils';
import { APPLICATION_API_USER } from '../../constants/UserConstant';

const ModalResetCredentials = (props) => {
  const { dispatch, user, modal, t } = props;
  const { values } = user;
  const { options } = modal;
  const [tempPass, setTempPass] = useState('');
  const [copied, setCopied] = useState(false);
  const fields = Object.keys(FIELDS).filter((key) => key.indexOf('reset') !== -1);

  const onClose = () => {
    dispatch(closeModal());
    dispatch(clearValues());
  };

  const onResetCredetials = () => {
    const payload = getKeyStruct('reset.', values);
    const url = API_USER_RESET;
    const obj = createPayload(API_TYPES.PUT, { username: getCookie(APPLICATION_API_USER), ...payload.reset });
    dispatch(showApplicationLoader('reseting-credentials', 'Reseting Credentials...'));
    return callAPI(url.replace('<id>', options.id), obj).then((json) => {
      dispatch(hideApplicationLoader('reseting-credentials'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('User temporary password is ready', MESSAGE_TYPES.SUCCESS));
        setTempPass(json.tempPassword);
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('configuring-user'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
  const handleCopyClick = () => {
    navigator.clipboard.writeText(tempPass);
    setCopied(true);
  };

  function renderTempPassword() {
    if (tempPass) {
      return (
        <div onClick={handleCopyClick} role="button" tabIndex={0} onKeyPress={handleCopyClick}>
          <span>{t('temporaryPassword')}</span>
          <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>{tempPass}</span>
          <span style={{ cursor: 'pointer' }}><i className="far fa-copy text-secondary padding-left-15" /></span>
          {copied && <span style={{ marginLeft: '5px', color: 'green' }}>Copied!</span>}
        </div>
      );
    }
  }

  return (
    <>
      <div className="modal-body noPadding">
        <SimpleBar className="max-h-400">
          <CardBody className="modal-card-body">
            <Form>
              {
                fields.map((field) => (<DMField dispatch={dispatch} user={user} fieldKey={field} key={`reset-${field}`} />))
              }
              {renderTempPassword()}
            </Form>
          </CardBody>
        </SimpleBar>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          {t('close')}
        </button>
        <button type="button" className="btn btn-success" onClick={onResetCredetials}>
          {t('reset')}
        </button>
      </div>
    </>
  );
};

export default (withTranslation()(ModalResetCredentials));
