import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { setActiveTab } from '../../store/actions';
import { JOBS_RECOVERY_PATH, PROTECTION_PLAN_DETAILS_PATH } from '../../constants/RouterConstants';
import { fetchByDelay } from '../../utils/SlowFetch';
import { changeRecoveryJobType } from '../../store/actions/JobActions';
import { NUMBER } from '../../constants/InputConstants';

function CleanupMsgRender({ data, dispatch, t }) {
  const { planID, msg, isSourceSite } = data;
  let baseAddress = PROTECTION_PLAN_DETAILS_PATH.replace(':id', planID);
  if (isSourceSite) {
    baseAddress = JOBS_RECOVERY_PATH;
  }

  const setPlanDetailsTab = () => {
    if (!isSourceSite) {
      fetchByDelay(dispatch, setActiveTab, NUMBER.TWO_HUNDRED, '6');
    }
    fetchByDelay(dispatch, changeRecoveryJobType, NUMBER.TWO_HUNDRED, 'VM');
  };

  return (
    <p>
      {msg}
      <Link to={`${baseAddress}`} onClick={setPlanDetailsTab}><p>{t('recovery.jobs')}</p></Link>
    </p>
  );
}

export default (withTranslation()(CleanupMsgRender));
