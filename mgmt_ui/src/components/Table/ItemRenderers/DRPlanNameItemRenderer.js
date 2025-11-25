import React from 'react';
import { Link } from 'react-router-dom';
import { PROTECTION_PLAN_DETAILS_PATH } from '../../../constants/RouterConstants';

function DRPlanNameItemRenderer({ data }) {
  const { name, id } = data;
  const path = PROTECTION_PLAN_DETAILS_PATH.replace(':id', id);
  return (
    <Link to={`${path}`}>
      {name}
    </Link>
  );
}

export default DRPlanNameItemRenderer;
