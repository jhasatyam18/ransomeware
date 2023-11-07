import React from 'react';
import 'boxicons';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getStorageWithUnit } from '../../../utils/AppUtils';

function VMSizeItemRenderer(props) {
  let size = 0;
  const { data } = props;
  const { virtualDisks = [] } = data;
  if (virtualDisks !== null) {
    virtualDisks.forEach((disk) => {
      if (!disk.isDeleted) {
        size += disk.size;
      }
    });
  }
  size = getStorageWithUnit(size);
  return (
    <div>
      {size}
    </div>
  );
}

function mapStateToProps(state) {
  const { drPlans } = state;
  return { drPlans };
}
export default connect(mapStateToProps)(withTranslation()(VMSizeItemRenderer));
