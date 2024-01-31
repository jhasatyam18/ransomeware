import React from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Input, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { uploadFiles } from '../../store/actions/DrPlaybooksActions';
import { API_GET_CONFIG_TEMPLATE_BY_ID } from '../../constants/ApiConstants';
import { closeModal } from '../../store/actions/ModalActions';
import PlaybookPlanIssues from '../Playbook/PlaybookPlanIssues';

function ModalPlaybookError({ dispatch, options, t }) {
  const { playbook } = options;
  const { planConfigurations } = playbook;
  if (!planConfigurations) {
    return null;
  }
  const onClose = () => {
    dispatch(closeModal());
  };

  const onFileChange = (e) => {
    const { id } = playbook;
    const url = API_GET_CONFIG_TEMPLATE_BY_ID.replace('<id>', id);
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    dispatch(uploadFiles(e.target.files[0], url, t('configure.playbook.download'), '', 'PUT'));
  };

  const renderFooter = () => (
    <Row>
      <Col sm={6} />
      <Col sm={6}>
        <div className="modal-footer">
          <label type="button" className="btn btn-success" htmlFor="fileUpload">{t('title.error.reupload')}</label>
          <Input type="file" id="fileUpload" name="fileUpload" className="modal-lic-upload" onSelect={onFileChange} onChange={onFileChange} />
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t('close')}
          </button>
        </div>
      </Col>
    </Row>
  );

  return (
    <>
      <SimpleBar style={{ maxHeight: '65vh' }}>
        {planConfigurations.map((excel) => (
          <PlaybookPlanIssues data={excel} />
        ))}
      </SimpleBar>
      {renderFooter()}
    </>
  );
}

export default (withTranslation()(ModalPlaybookError));
