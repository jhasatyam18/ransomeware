import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tr, Th } from 'react-super-responsive-table';
// import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { getAppKey } from '../../utils/AppUtils';

class DMTableRow extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { dispatch, onSelect, data } = this.props;
    dispatch(onSelect(data, e.target.checked));
  }

  getObjectValue(object, field) {
    const parts = field.split('.');
    if (parts.length > 1) {
      return object[parts[0]][parts[1]];
    }
    return object[field];
  }

  hasOwnRow(key) {
    const { data } = this.props;
    if (data.id) {
      return key === `${data.id}`;
    }
    return false;
  }

  renderCellContent(tableHeader, data) {
    const { field } = tableHeader;
    return this.getObjectValue(data, field);
  }

  renderCheckBox(index) {
    const { isSelectable, selectedData } = this.props;
    const rKey = `${index}-${getAppKey()}`;
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
        {this.renderCheckBox()}
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
  isSelectable: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedData: PropTypes.any.isRequired,
};

DMTableRow.propTypes = propTypes;

export default DMTableRow;
