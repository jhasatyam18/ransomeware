import React from 'react';
import 'boxicons';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { PLATFORM_TYPES } from '../../../constants/InputConstants';

function VMSizeItemRenderer(props) {
  let size = 0;
  const { data, drPlans } = props;
  const { protectionPlan } = drPlans;
  const { virtualDisks = [] } = data;
  if (virtualDisks !== null) {
    virtualDisks.forEach((disk) => {
      const devisorVal = 1048576;
      if (protectionPlan.protectedSite.platformDetails.platformType === PLATFORM_TYPES.VMware) {
        const kb = disk.size / devisorVal;
        size += kb;
      } else {
        size += disk.size;
      }
    });
  }
  return (
    <div>
      {size}
      GB
    </div>
  );
}

function mapStateToProps(state) {
  const { drPlans } = state;
  return { drPlans };
}
export default connect(mapStateToProps)(withTranslation()(VMSizeItemRenderer));
