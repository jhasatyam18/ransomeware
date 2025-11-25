import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Input, Label, Row } from 'reactstrap';
import { fetchLicenses } from '../../store/actions/LicenseActions';
import { API_LICENSE_INSTALL, API_LICENSE_UPLOAD, API_LICENSE_UPLOAD_VALIDATE } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { closeModal } from '../../store/actions/ModalActions';
import { API_TYPES, callAPI, createPayload, getUrlPath } from '../../utils/ApiUtils';

class ModalLicense extends Component {
  constructor() {
    super();
    // state init -> uploading -> validating -> success -> error
    this.state = { license: {}, fileName: '', state: 'init' };
    this.onClose = this.onClose.bind(this);
    this.onInstallNewLicense = this.onInstallNewLicense.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  onInstallNewLicense() {
    const { fileName } = this.state;
    const { dispatch } = this.props;
    if (fileName === '') {
      dispatch(addMessage('Upload and validate license file for installation', MESSAGE_TYPES.ERROR));
      return;
    }
    const obj = createPayload(API_TYPES.POST, {});
    callAPI(API_LICENSE_INSTALL.replace('<file>', fileName), obj).then(() => {
      dispatch(addMessage(`License - ${fileName} applied successfully.`, MESSAGE_TYPES.SUCCESS));
      dispatch(closeModal());
      dispatch(fetchLicenses());
    },
    (err) => {
      this.setState({ state: 'error' });
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  }

  onValidateFile = () => {
    const { dispatch } = this.props;
    const { fileName } = this.state;
    this.setState({ state: 'validating' });
    callAPI(API_LICENSE_UPLOAD_VALIDATE.replace('<file>', fileName)).then((json) => {
      const { Type, Platform, AllowRecovery, MaxRecoveriesAllowed, AllowMigration, MaxMigrationsAllowed } = json;
      const data = { Type, Platform, AllowRecovery, MaxRecoveriesAllowed, AllowMigration, MaxMigrationsAllowed };
      data.AllowRecovery = (json.AllowRecovery ? 'Yes' : 'No');
      data.AllowMigration = (json.AllowMigration ? 'Yes' : 'No');
      setTimeout(() => this.setState({ state: 'success', license: data }), 1500);
    },
    (err) => {
      this.setState({ state: 'error' });
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };

  dragOver = (e) => {
    e.preventDefault();
  };

  dragEnter = (e) => {
    e.preventDefault();
  };

  dragDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    this.setState({
      fileName: files[0].name,
      state: 'uploading',
    });
    this.uploadFile(files[0]);
  };

  onFileChange = (e) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    this.setState({
      fileName: e.target.files[0].name,
      state: 'uploading',
    });
    this.uploadFile(e.target.files[0]);
  };

  uploadFile(file) {
    const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('file', file);
    const url = getUrlPath(API_LICENSE_UPLOAD);
    fetch(url, {
      method: 'POST',
      body: formData,
    }).then((res) => {
      if (res.ok) {
        setTimeout(() => this.onValidateFile(), 1500);
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  }

  renderFooter() {
    const { state } = this.state;
    const isDisabled = state !== 'success';
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
        <button type="button" className="btn btn-success" onClick={this.onInstallNewLicense} disabled={isDisabled}> Install </button>
      </div>
    );
  }

  renderLicenseDetails() {
    const { t } = this.props;
    const { state, license } = this.state;
    const { Type, Platform, AllowRecovery, MaxRecoveriesAllowed, AllowMigration, MaxMigrationsAllowed } = license;
    if (state === 'success') {
      return (
        <div className="padding-left-20">
          <Label className="text-center width-100">License Details</Label>
          <Row class="form-horizontal margin-left-20">
            <Col sm={3}>{t('Type')}</Col>
            <Col sm={3} className="text-muted">{Type}</Col>
            <Col sm={3}>{t('Platform')}</Col>
            <Col sm={3} className="text-muted">{Platform}</Col>
            <Col sm={12}>
              <hr />
            </Col>
            <Col sm={3}>{t('AllowRecovery')}</Col>
            <Col sm={3} className="text-muted">{AllowRecovery}</Col>
            <Col sm={3}>{t('MaxRecoveriesAllowed')}</Col>
            <Col sm={3} className="text-muted">{MaxRecoveriesAllowed}</Col>
            <Col sm={3}>{t('AllowMigration')}</Col>
            <Col sm={3} className="text-muted">{AllowMigration}</Col>
            <Col sm={3}>{t('MaxMigrationsAllowed')}</Col>
            <Col sm={3} className="text-muted">{MaxMigrationsAllowed}</Col>
            {Type === 'Trial' ? (
              <>
                <Col sm={12}>
                  <hr />
                </Col>
                <Col sm={3}>{t('license.validity')}</Col>
                <Col sm={3}>{t('license.validity.30.days')}</Col>
              </>
            ) : null}
            {Type === 'Yearly' ? (
              <>
                <Col sm={12}>
                  <hr />
                </Col>
                <Col sm={3}>{t('license.validity')}</Col>
                <Col sm={3}>{t('license.validity.1.year')}</Col>
              </>
            ) : null}
          </Row>
          <div className="upload__success__info">
            <span>{t('license.validated.readyto.install')}</span>
          </div>
        </div>
      );
    }
    return null;
  }

  renderValidating() {
    const { state } = this.state;
    if (state !== 'validating' && state !== 'uploading') {
      return null;
    }
    return (
      <div className="details">
        <div className="progress">
          <div className="progress-bar progress-bar-striped progress-bar-animated width-100" />
        </div>
      </div>
    );
  }

  renderUpload() {
    const { state } = this.state;
    const { t } = this.props;
    let msg = (state === 'validating' ? t('license.validating') : t('license.drag.drop'));
    msg = (state === 'uploading' ? 'Uploading license file' : msg);
    return (
      <>
        <div
          className="upload__icon"
          onDragOver={this.dragOver}
          onDragEnter={this.dragEnter}
          onDragLeave={this.dragDrop}
          onDrop={this.dragDrop}
        >
          <label htmlFor="fileUpload" className="label">
            <i className="fas fa-cloud-upload-alt fa-4x" />
          </label>
          <Input type="file" id="fileUpload" name="fileUpload" className="modal-lic-upload" onSelect={this.onFileChange} onChange={this.onFileChange} />
        </div>
        <span>{msg}</span>
      </>
    );
  }

  render() {
    const { state } = this.state;
    return (
      <>
        <div className="modal-body noPadding">
          <div className={`upload__form upload__${state}`}>
            {this.renderUpload()}
            {this.renderValidating()}
            {this.renderLicenseDetails()}
          </div>
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
export default connect(mapStateToProps)(withTranslation()(ModalLicense));
