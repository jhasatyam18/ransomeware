import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Input, Label } from 'reactstrap';
import { closeModal } from '../../store/actions/ModalActions';

function PlaybookUploadModal(props) {
  const { t } = props;
  const [state, setState] = useState('init');
  const [name, setName] = useState('');
  const [file, setFile] = useState('');

  const onClose = () => {
    const { dispatch } = props;
    dispatch(closeModal());
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const uploadFile = () => {
    const { options } = props;
    const { onUpload } = options;

    onUpload(file);
  };

  const dragDrop = (e) => {
    e.preventDefault();
    const { files } = e.dataTransfer;
    setState('uploading');
    setName(files[0].name);
    uploadFile(files[0]);
  };

  const onFileChange = (e) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    setState('success');
    setName(e.target.files[0].name);
    setFile(e.target.files[0]);
  };

  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t('close')}
      </button>
      {name ? (
        <button type="button" className="btn btn-success" onClick={uploadFile} disabled={!name}>
          {t('upload')}
        </button>
      ) : null}
    </div>
  );

  const renderSinglePlaybookDetailsPages = () => {
    if (state === 'success') {
      return (
        <div className="padding-left-20">
          <div className="upload__success__info">
            <Label className="text-center width-100 ">
              {t('file.details')}
            </Label>
            <Label className="text-center width-100">{name}</Label>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderValidating = () => {
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
  };

  const renderUpload = () => {
    let msg = (state === 'validating' ? t('template.validating') : t('template.drag.file'));
    msg = (state === 'uploading' ? 'Uploading Template file' : msg);
    return (
      <>
        <div
          className="upload__icon"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={dragDrop}
        >
          <label htmlFor="fileUpload" className="label">
            <i className="fas fa-cloud-upload-alt fa-4x" />
          </label>
          <Input accept=".xlsx" type="file" id="fileUpload" name="fileUpload" className="modal-lic-upload" onSelect={onFileChange} onChange={onFileChange} />
        </div>
        <span>{name ? null : msg}</span>
      </>
    );
  };

  return (
    <>
      <div className="modal-body noPadding">
        <div className={`upload__form upload__${state}`}>
          {renderUpload()}
          {renderValidating()}
          {renderSinglePlaybookDetailsPages()}
        </div>
      </div>
      {renderFooter()}
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(PlaybookUploadModal));
