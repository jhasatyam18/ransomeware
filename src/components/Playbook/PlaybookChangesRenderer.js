import React from 'react';
import { withTranslation } from 'react-i18next';
import { clearValues } from '../../store/actions';
import { playbookFetchPlanDiff } from '../../store/actions/DrPlaybooksActions';

function PlaybookChangesRenderer({ dispatch, data, field, t }) {
  const planId = data[field];
  const onView = () => {
    dispatch(clearValues());
    dispatch(playbookFetchPlanDiff(planId));
  };
  return (
    <a href="#" onClick={onView}>
      {t('view')}
    </a>
  );
}

export default (withTranslation()(PlaybookChangesRenderer));
