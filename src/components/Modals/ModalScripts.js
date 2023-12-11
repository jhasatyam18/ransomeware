import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { addMessage } from '../../store/actions/MessageActions';
import { closeModal } from '../../store/actions/ModalActions';
import { fetchScript, hideApplicationLoader, refreshApplication, showApplicationLoader } from '../../store/actions';
import { API_USER_SCRIPT } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { getUrlPath } from '../../utils/ApiUtils';
import DMToolTip from '../Shared/DMToolTip';

function ModalScripts(props) {
  const { t, dispatch, options } = props;
  const { data } = options;
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [type, setType] = useState('preScript');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [isPreOnly, setPreOnly] = useState(false);
  const [isPostOnly, setPostOnly] = useState(false);

  function renderTooltip(fieldInfo) {
    return (
      <DMToolTip tooltip={fieldInfo} />
    );
  }
  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      if (typeof data !== 'undefined' && typeof data.scriptType !== 'undefined' && typeof data.description !== 'undefined') {
        setDescription(data.description);
        setType(data.scriptType);
      }
      if (data && typeof data.fieldKey !== 'undefined') {
        // handle case insensitive text
        const key = data.fieldKey.toLowerCase();
        const isPre = key.indexOf('prescript') !== -1;
        setPreOnly(isPre);
        setPostOnly(!isPre);
        setType((isPre ? 'preScript' : 'postScript'));
      } if (typeof data !== 'undefined' && typeof data.scriptType !== 'undefined' && typeof data.description !== 'undefined') {
        setDescription(data.description);
        setType(data.scriptType);
      }
      if (data && typeof data.fieldKey !== 'undefined') {
        // handle case insensitive text
        const key = data.fieldKey.toLowerCase();
        const isPre = key.indexOf('prescript') !== -1;
        setPreOnly(isPre);
        setPostOnly(!isPre);
        setType((isPre ? 'preScript' : 'postScript'));
      }
    }
    return () => {
      isUnmounting = true;
    };
  }, []);

  const isWizardUpload = () => isPostOnly || isPreOnly;

  const isValidForm = () => {
    if (name === '') {
      dispatch(addMessage('Select script file', MESSAGE_TYPES.ERROR));
      return false;
    }
    if (password === '') {
      setErrors(['Password required']);
      return false;
    }
    if (typeof data !== 'undefined' && data.name !== name && !isWizardUpload()) {
      dispatch(addMessage(`File name must be same while updating script. Initial filename was ${data.name}`, MESSAGE_TYPES.ERROR));
      return false;
    }
    return true;
  };

  const saveScript = () => {
    if (isValidForm()) {
      dispatch(showApplicationLoader('USER_SCRIPT', 'Uploading script..'));
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', description);
      formData.append('name', name);
      formData.append('scriptType', type);
      formData.append('password', password);
      let url = getUrlPath(API_USER_SCRIPT);
      if (typeof data !== 'undefined' && !isWizardUpload()) {
        url = `${url}/${data.ID}`;
      }
      fetch(url, {
        method: ((typeof data !== 'undefined' && !isWizardUpload()) ? 'PUT' : 'POST'),
        body: formData,
      }).then((response) => {
        if (response.ok) {
          dispatch(hideApplicationLoader('USER_SCRIPT'));
          dispatch(closeModal());
          if (data && data.fieldKey !== 'undefined') {
            dispatch(fetchScript(data.fieldKey, name));
          } else {
            dispatch(refreshApplication());
          }
        } else {
          dispatch(hideApplicationLoader('USER_SCRIPT'));
          response.text().then((text) => {
            dispatch(addMessage(text, MESSAGE_TYPES.ERROR));
          });
        }
      })
        .catch((err) => {
          dispatch(hideApplicationLoader('USER_SCRIPT'));
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        });
    }
  };

  const onFileChange = (e) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setFile(e.target.files[0]);
    setName(e.target.files[0].name);
  };

  const onClose = () => {
    dispatch(closeModal());
  };

  const renderForm = () => {
    const hasErrors = Object.keys(errors).length;
    return (
      <Form className="margin-15">
        <FormGroup>
          <div className="upload__script__form">
            <div className="upload__icon">
              <label htmlFor="fileUpload" className="label">
                <i className="fas fa-cloud-upload-alt fa-4x" />
              </label>
              <Input type="file" id="fileUpload" name="fileUpload" style={{ visibility: 'none', display: 'none' }} onSelect={onFileChange} onChange={onFileChange} />
            </div>
            {name === '' ? t('select.file.for.upload') : name}
          </div>
        </FormGroup>
        <FormGroup>
          <Row>
            <Col sm={4}>
              <Label className="padding-right-20">Script Type</Label>
            </Col>
            <Col sm={8}>
              <div className="form-check-inline">
                <Label className="form-check-label" for="preScript-option">
                  <input type="radio" className="form-check-input" id="preScript-option" name="scriptOptions" value={type === 'preScript'} checked={type === 'preScript'} onChange={() => { setType('preScript'); }} disabled={isPostOnly} />
                  {t('pre.script')}
                </Label>
              </div>
              <div className="form-check-inline">
                <Label className="form-check-label" for="postScript-option">
                  <input type="radio" className="form-check-input" id="postScript-option" name="scriptOptions" value={type === 'postScript'} checked={type === 'postScript'} onChange={() => { setType('postScript'); }} disabled={isPreOnly} />
                  {t('post.script')}
                </Label>
              </div>
            </Col>
          </Row>

        </FormGroup>
        <FormGroup className="row mb-4 form-group">
          <Col sm={4}>
            <label htmlFor="horizontal-Input margin-top-10 padding-top=10" className="form-check-label">
              {t('description')}
            </label>
          </Col>
          <Col sm={7}>
            <div>
              <input type="TEXT" className="form-control" id="scriptDescription" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </Col>
          <Col sm={1}>
            {renderTooltip('info.script.description')}
          </Col>
        </FormGroup>
        <FormGroup className="row mb-4 form-group">
          <Col sm={4}>
            <label htmlFor="horizontal-Input margin-top-10 padding-top=10" className="form-check-label">
              {t('login.password')}
            </label>
          </Col>
          <Col sm={7}>
            <div>
              <input
                invalid={hasErrors}
                type="password"
                className="form-control"
                id="scriptPassword"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
              />
            </div>
            {hasErrors ? (
              <small className="form-text app_danger" htmlFor="scriptPassword">
                {errors[0]}
              </small>
            ) : null}
          </Col>
          <Col sm={1}>
            {renderTooltip('info.script.password')}
          </Col>
        </FormGroup>
      </Form>
    );
  };

  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>Close </button>
      <button type="button" className="btn btn-success" onClick={saveScript}> Save </button>
    </div>
  );

  const render = () => (
    <>
      <div className="modal-body noPadding">
        {renderForm()}
      </div>
      {renderFooter()}
    </>
  );
  return render();
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ModalScripts));
