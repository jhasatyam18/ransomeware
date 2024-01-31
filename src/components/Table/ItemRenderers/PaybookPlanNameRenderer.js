import React from 'react';
import { Link } from 'react-router-dom';
import { PROTECTION_PLAN_DETAILS_PATH } from '../../../constants/RouterConstants';

function PlaybookPlanNameRenderer({ data }) {
  if (typeof data === 'undefined') {
    return null;
  }

  const { name, planID } = data;
  if (planID === 0) {
    return name;
  }
  const path = PROTECTION_PLAN_DETAILS_PATH.replace(':id', planID);
  return (
    <Link to={`${path}`}>
      {name}
    </Link>
  );
}
export default PlaybookPlanNameRenderer;
