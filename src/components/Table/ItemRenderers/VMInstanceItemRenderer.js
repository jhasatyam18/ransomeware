import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { calculateChangedData } from '../../../utils/AppUtils';
import { PLATFORM_TYPES } from '../../../constants/InputConstants';

function VMInstanceItemRenderer(props) {
  const { data, drPlans } = props;
  const { protectionPlan } = drPlans;
  const { recoverySite } = protectionPlan;
  const { memoryMB, instanceType, numCPU } = data;
  if (!data) {
    return '-';
  }

  const renderLabel = () => {
    const memory = calculateChangedData(memoryMB);
    if (recoverySite.platformDetails.platformType === PLATFORM_TYPES.VMware) {
      return (
        <>
          <span>{`${memory},`}</span>
             &nbsp;
          <span>{`${numCPU} CPU`}</span>
        </>
      );
    }
    return (
      <span>
        {instanceType}
      </span>
    );
  };
  return (
    <div>
      {renderLabel()}
    </div>
  );
}
function mapStateToProps(state) {
  const { drPlans } = state;
  return { drPlans };
}
export default connect(mapStateToProps)(withTranslation()(VMInstanceItemRenderer));
