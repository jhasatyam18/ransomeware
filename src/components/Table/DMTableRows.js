import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tr, Th } from 'react-super-responsive-table';
import { getAppKey } from '../../utils/AppUtils';
import { getItemRendererComponent } from '../../utils/ComponentFactory';

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
    return getItemRendererComponent(render, data, field, user, dispatch);
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
    const { isSelectable, selectedData, primaryKey, name, data } = this.props;
    // check row is mark as disabled
    if (typeof data.isDisabled !== 'undefined' && data.isDisabled === true) {
      return (
        <Th />
      );
    }
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
      <Th key={`${tableHeader.field}-${index}`} className="itemRendererContainer">
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
