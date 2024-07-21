import React from 'react';
import { Link, useLocation } from 'react-router-dom/cjs/react-router-dom';
import { JOBS_RECOVERY_PATH, JOBS_REPLICATION_PATH, PROTECTION_PLAN_DETAILS_PATH } from '../../../constants/RouterConstants';
import { setActiveTab } from '../../../store/actions';
import { CONSTANT_NUMBERS } from '../../../constants/InputConstants';

function JobsVMNameRenderer({ data, dispatch }) {
  const location = useLocation();
  const isJobPage = (location.pathname.includes(JOBS_REPLICATION_PATH) || location.pathname.includes(JOBS_RECOVERY_PATH));

  let planID;
  let baseAddress;
  switch (location.pathname) {
    case JOBS_REPLICATION_PATH:
      planID = data.protectionPlanId;
      baseAddress = PROTECTION_PLAN_DETAILS_PATH.replace(':id', planID);
      break;
    case JOBS_RECOVERY_PATH:
      planID = data.protectionPlanID;
      baseAddress = PROTECTION_PLAN_DETAILS_PATH.replace(':id', planID);
      break;
    default:
      baseAddress = '/';
      break;
  }

  const setPlanDetailsTab = () => {
    dispatch(setActiveTab(CONSTANT_NUMBERS.ONE));
  };

  return (
    <>
      {(isJobPage) ? (
        <Link to={`${baseAddress}`} onClick={setPlanDetailsTab}><p>{ data.vmName }</p></Link>
      ) : (
        <p>{data.vmName}</p>
      )}
    </>
  );
}

export default JobsVMNameRenderer;
