import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import {
  Table, Tbody, Td, Th, Thead, Tr,
} from 'react-super-responsive-table';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMToolTip from '../Shared/DMToolTip';
import DMCollapsibleRow from './DMCollapsibleRow';

const DMCollapsibleTable = (props) => {
  const [selected, setSelected] = useState(false);
  const { onSelectAll, dispatch, data = [], tableID, t, columns, onSelect, selectedData, childPrimaryKey, primaryKey, user, toggleRow, tblName } = props;

  const onChange = (e) => {
    setSelected(e.target.checked);
    dispatch(onSelectAll(e.target.checked, data));
  };

  const renderCheckBoxPlaceHolder = () => {
    const { isSelectable, name } = props;
    if (isSelectable && name && onSelectAll) {
      return (
        <Th className="dm_table_th">
          <div className="custom-control custom-checkbox" key="global-select">
            <input
              type="checkbox"
              className="custom-control-input"
              id={`chk-${name}`}
              checked={selected}
              onChange={onChange}
              name={`chk-${name}`}
            />
            <label className="custom-control-label" htmlFor={`chk-${name}`}>
              &nbsp;
            </label>
          </div>
        </Th>
      );
    }
    if (isSelectable) {
      return (<Th className="dmtable-checkbox" />);
    }
    return null;
  };
  const renderHeaderLabels = () => columns
    .map((col, index) => (
      <Th key={`${index + 1}-${col.label}`} width={`${col.width * 10}%`}>
        {' '}
        <Row>
          <Col sm={9}>{t(col.label)}</Col>
          <Col sm={1}>{typeof col.info !== 'undefined' && col.info !== null && col.info && <DMToolTip tooltip={col.info} />}</Col>
        </Row>
        {' '}
      </Th>
    ));
  const renderHeaders = () => (
    <Thead>
      <Tr>
        {renderCheckBoxPlaceHolder()}
        {renderHeaderLabels()}
      </Tr>
    </Thead>
  );

  const renderNoDataToShow = () => (
    <Tr>
      <Td colSpan={Object.keys(columns).length + 1}> No Data To Display</Td>
    </Tr>
  );

  const renderRows = () => data.map((row, index) => (
    <DMCollapsibleRow
      columns={columns}
      dispatch={dispatch}
      index={index}
      data={row}
      isSelectable
      onSelect={onSelect}
      selectedData={selectedData}
      primaryKey={primaryKey}
      user={user}
      name={`${tblName}`}
      key={`dmtable-row-${index + 1}`}
      toggleRow={toggleRow}
      childPrimaryKey={childPrimaryKey}
    />
  ));

  return (
    <Table className="table table-bordered" id={tableID}>
      {renderHeaders()}
      <Tbody id={tblName}>
        {data && data.length > 0 ? renderRows() : renderNoDataToShow()}
      </Tbody>
    </Table>
  );
};
const propTypes = {
  data: PropTypes.any.isRequired,
  columns: PropTypes.any.isRequired,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  selectedData: PropTypes.any,
  primaryKey: PropTypes.string,
  tblName: PropTypes.string,
  tableID: PropTypes.string,
  toggleRow: PropTypes.func,
};

DMCollapsibleTable.propTypes = propTypes;

function mapStateToProps(state) {
  const { user, drplans } = state;
  return { user, drplans };
}
export default connect(mapStateToProps)(withTranslation()(DMCollapsibleTable));
