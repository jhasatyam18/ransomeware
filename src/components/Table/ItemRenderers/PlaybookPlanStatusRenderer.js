import React from 'react';
import { withTranslation } from 'react-i18next';
import { Badge } from 'reactstrap';

function PlaybookPlanStatusRenderer({ data, field, t }) {
  let status = data[field];
  if (status === 'playbookPlanUploaded' || status === 'playbookPlanValidated') {
    if (status === 'playbookPlanValidated') {
      status = t('title.plan.validated');
    } else {
      status = t('title.plan.uploaded');
    }
    return (
      <Badge id="status-stsua" className="font-size-13 badge-soft-secondary" pill>{status}</Badge>
    );
  }
  if (status === 'playbookPlanValidationFailed') {
    return (
      <Badge id="status-stsua" className="font-size-13 badge-soft-danger" pill>{t('title.plan.validation.failed')}</Badge>
    );
  }
  if (status === 'playbookPlanCreated') {
    return (
      <Badge id="status-stsua" className="font-size-13 badge-soft-success" pill>{t('title.plan.created')}</Badge>
    );
  }
  if (status === 'playbookPlanUpdated') {
    return (
      <Badge id="status-stsua" className="font-size-13 badge-soft-success" pill>{t('title.plan.reconfigured')}</Badge>
    );
  }
  return '-';
}

export default (withTranslation()(PlaybookPlanStatusRenderer));
