import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tr, Th } from 'react-super-responsive-table';
import { getAppKey } from '../../utils/AppUtils';
import { DATE_ITEM_RENDERER, DR_PLAN_NAME_ITEM_RENDERER, OS_TYPE_ITEM_RENDARER, VM_SIZE_ITEM_RENDERER, STATUS_ITEM_RENDERER, TRANSFER_SIZE_ITEM_RENDERER, RECOVERY_TYPE_ITEM_RENDERER, TIME_DURATION_RENDERER, RECOVERY_SITE_LINK_ITEM_RENDERER, SSH_RDP_ITEM_RENDERER, VM_USERNAME_ITEM_RENDERER, VM_UPASSWORD_ITEM_RENDERER, REPLICATION_INTERVAL_ITEM_RENDERER } from '../../constants/TableConstants';
import OsTypeItemRenderer from './OsTypeItemRenderer';
import VMSizeItemRenderer from './VMSizeItemRenderer';
import DRPlanNameItemRenderer from './DRPlanNameItemRenderer';
import DateItemRenderer from './DateItemRenderer';
import StatusItemRenderer from './StatusItemRenderer';
import TransferSizeItemRenderer from './TransferSizeItemRenderer';
import RecoveryTypeItemRenderer from './RecoveryTypeItemRenderer';
import TimeDurationItemRenderer from './TimeDurationItemRenderer';
import RecoverySiteLinkRenderer from './RecoverySiteLinkRenderer';
import SshRdpRenderer from './SshRdpRenderer';
import VMUsernameItemRenderer from './VMUsernameItemRenderer';
import VMPasswordItemRenderer from './VMPasswordItemRenderer';
import ReplicationIntervalItemRenderer from './ReplicationIntervalItemRenderer';

class DMTableRow extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { dispatch, onSelect, data, primaryKey } = this.props;
    dispatch(onSelect(data, e.target.checked, primaryKey));
  }

  getItemRenderer(render, data, field) {
    const { user, dispatch } = this.props;
    switch (render) {
      case OS_TYPE_ITEM_RENDARER:
        return <OsTypeItemRenderer data={data} />;
      case VM_SIZE_ITEM_RENDERER:
        return <VMSizeItemRenderer data={data} />;
      case DR_PLAN_NAME_ITEM_RENDERER:
        return <DRPlanNameItemRenderer data={data} />;
      case DATE_ITEM_RENDERER:
        return <DateItemRenderer data={data} field={field} />;
      case STATUS_ITEM_RENDERER:
        return <StatusItemRenderer data={data} field={field} />;
      case TRANSFER_SIZE_ITEM_RENDERER:
        return <TransferSizeItemRenderer data={data} />;
      case RECOVERY_TYPE_ITEM_RENDERER:
        return <RecoveryTypeItemRenderer data={data} field={field} />;
      case TIME_DURATION_RENDERER:
        return <TimeDurationItemRenderer data={data} field={field} />;
      case RECOVERY_SITE_LINK_ITEM_RENDERER:
        return <RecoverySiteLinkRenderer data={data} field={field} user={user} />;
      case SSH_RDP_ITEM_RENDERER:
        return <SshRdpRenderer data={data} field={field} user={user} />;
      case VM_USERNAME_ITEM_RENDERER:
        return <VMUsernameItemRenderer data={data} user={user} dispatch={dispatch} />;
      case VM_UPASSWORD_ITEM_RENDERER:
        return <VMPasswordItemRenderer data={data} user={user} dispatch={dispatch} />;
      case REPLICATION_INTERVAL_ITEM_RENDERER:
        return <ReplicationIntervalItemRenderer data={data} field={field} />;
      default:
        return (<div> 404 </div>);
    }
  }

  getObjectValue(object, field) {
    const parts = field.split('.');
    switch (parts.length) {
      case 2:
        return object[parts[0]][parts[1]];
      case 3:
        return object[parts[0]][parts[1]][parts[2]];
      case 4:
        return object[parts[0]][parts[1]][parts[2]][parts[3]];
      default:
        return object[field];
    }
  }

  hasOwnRow(key) {
    const { data, primaryKey } = this.props;
    if (primaryKey) {
      return key === `${data[primaryKey]}`;
    }
    return false;
  }

  renderCellContent(tableHeader, data) {
    const { field, itemRenderer } = tableHeader;
    if (itemRenderer) {
      return this.getItemRenderer(itemRenderer, data, field);
    }
    return this.getObjectValue(data, field);
  }

  renderCheckBox(index) {
    const { isSelectable, selectedData, primaryKey, name } = this.props;
    let rKey = '';
    const keyVal = (typeof index !== 'undefined' ? index : getAppKey());
    if (name) {
      rKey = `chk-${primaryKey}-${keyVal}-${name}`;
    } else {
      rKey = `chk-${primaryKey}-${keyVal}`;
    }

    let showSelected = false;
    let hasOwnDataInSelection = null;
    if (selectedData) {
      hasOwnDataInSelection = Object.keys(selectedData).filter((key) => this.hasOwnRow(key));
      if (hasOwnDataInSelection && hasOwnDataInSelection.length > 0) {
        showSelected = true;
      }
    }
    if (isSelectable) {
      return (
        <Th>
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id={rKey}
              checked={showSelected}
              onChange={this.onChange}
              name={rKey}
            />
            <label className="custom-control-label" htmlFor={rKey}>
              &nbsp;
            </label>
          </div>
        </Th>
      );
    }
    return null;
  }

  render() {
    const { data, columns, index } = this.props;
    const cells = columns.map((tableHeader) => (
      <Th key={`${tableHeader.field}-${index}`}>
        {this.renderCellContent(tableHeader, data)}
      </Th>
    ));
    return (
      <Tr>
        {this.renderCheckBox(index)}
        {cells}
      </Tr>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  columns: PropTypes.any.isRequired,
  index: PropTypes.any.isRequired,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  selectedData: PropTypes.any,
  primaryKey: PropTypes.string,
};

DMTableRow.propTypes = propTypes;

export default DMTableRow;
