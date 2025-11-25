import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getMemoryInfo } from '../../../utils/AppUtils';
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
    let memory = getMemoryInfo(memoryMB);
    memory = memory.join(' ');
    if (recoverySite.platformDetails.platformType === PLATFORM_TYPES.VMware) {
      return (
        <>
          <span>{`${memory} ,`}</span>
             &nbsp;
          <span>{`${numCPU} VCPU`}</span>
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
