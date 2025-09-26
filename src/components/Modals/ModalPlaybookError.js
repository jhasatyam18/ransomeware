import React from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Input, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { API_GET_CONFIG_TEMPLATE_BY_ID } from '../../constants/ApiConstants';
import { hideApplicationLoader, showApplicationLoader } from '../../store/actions';
import { uploadFiles } from '../../store/actions/DrPlaybooksActions';
import { closeModal } from '../../store/actions/ModalActions';
import { exportIssues } from '../../utils/ReportUtils';
import PlaybookPlanIssues from '../DRPlans/Playbook/PlaybookPlanIssues';

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

  const exportIssuesToExcel = async () => {
    if (planConfigurations.length === 0 || typeof planConfigurations === 'undefined') {
      return null;
    }
    const { planValidationResponse } = planConfigurations[0];
    if (typeof planValidationResponse === 'undefined' || planValidationResponse === '') {
      return null;
    }
    dispatch(showApplicationLoader('export_issues', t('export.identified.issues')));
    const validationIssues = JSON.parse(planValidationResponse);
    const res = await exportIssues(validationIssues);
    dispatch(hideApplicationLoader('export_issues', res));
  };

  const renderFooter = () => (
    <Row>
      <Col sm={12} />
      <Col sm={12}>
        <div className="modal-footer">
          <label type="button" className="btn btn-success" htmlFor="fileUpload">{t('title.error.reupload')}</label>
          <Input type="file" accept=".xlsx*" id="fileUpload" name="fileUpload" className="modal-lic-upload" onSelect={onFileChange} onChange={onFileChange} />
          <button type="button" className="btn btn-secondary" onClick={async () => { await exportIssuesToExcel(); }}>
            {t('export.identified.issues')}
          </button>
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
