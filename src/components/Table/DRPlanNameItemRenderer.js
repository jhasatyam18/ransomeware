import React from 'react';
import { Link } from 'react-router-dom';
import { DR_PLAN_DETAILS } from '../../constants/RouterConstants';

function DRPlanNameItemRenderer({ data }) {
  const { name, Id } = data;
  const path = DR_PLAN_DETAILS.replace(':id', Id);
  return (
    <Link to={`${path}`}>
      {name}
    </Link>
  );
}

export default DRPlanNameItemRenderer;
