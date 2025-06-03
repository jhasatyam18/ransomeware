import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Table, Tbody, Td, Th, Thead, Tr,
} from 'react-super-responsive-table';
import { Card, CardBody, Col, Row } from 'reactstrap';
import DMTableRow from './DMTableRows';
import DMToolTip from '../Shared/DMToolTip';

class DMTable extends Component {
  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = { selected: false };
  }

  static getDerivedStateFromProps(nextProps) {
    const { data, selectedData } = nextProps;
    if (data && selectedData) {
      const keys = Object.keys(selectedData).length;
      if (keys === 0 || keys !== data.length) {
        return ({ selected: false });
      }
      if (keys === data.length) {
        return ({ selected: true });
      }
    }
    return null;
  }

  onChange(e) {
    const { onSelectAll, dispatch, data } = this.props;
    this.setState({ selected: e.target.checked });
    dispatch(onSelectAll(e.target.checked, data));
  }

  renderHeaderLables(columns) {
    const { t } = this.props;
    return columns
      .map((col, index) => (
        <Th key={`${index + 1}-${col.lable}`} width={`${col.width * 10}%`}>
          {' '}
          <Row>
            <Col sm={col.info ? 9 : 12} className={`${col.info ? 'pr-0' : ''}`}>{t(col.label)}</Col>
            {typeof col.info !== 'undefined' && col.info !== null && col.info && <Col sm={1}><DMToolTip tooltip={col.info} /></Col>}
          </Row>
          {' '}
        </Th>
      ));
  }

  renderCheckBoxPlaceHolder() {
    const { isSelectable, name } = this.props;
    const { selected } = this.state;
    if (isSelectable && name) {
      return (
        <Th className="dm_table_th">
          <div className="form-check font-size-16 ">
            <input
              type="checkbox"
              className="form-check-input"
              id={`chk-${name}`}
              checked={selected}
              onChange={this.onChange}
              name={`chk-${name}`}
            />
            <label className="form-check-label" htmlFor={`chk-${name}`}>
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
  }

  renderHeaders() {
    const { columns } = this.props;
    return (
      <Thead>
        <Tr>
          {this.renderCheckBoxPlaceHolder()}
          {this.renderHeaderLables(columns)}
        </Tr>
      </Thead>
    );
  }

  renderNoDataToShow() {
    const { columns } = this.props;
    return (
      <Tr>
        <Td colSpan={Object.keys(columns).length + 1}> No Data To Display</Td>
      </Tr>
    );
  }

  renderRows() {
    const {
      dispatch, data, columns, isSelectable, onSelect, selectedData, primaryKey, user, name,
    } = this.props;
    return data.map((row, index) => (
      <DMTableRow
        columns={columns}
        dispatch={dispatch}
        index={index}
        data={row}
        isSelectable={isSelectable}
        onSelect={onSelect}
        selectedData={selectedData}
        primaryKey={primaryKey}
        user={user}
        name={name}
        key={`dmtable-row-${index + 1}`}
      />
    ));
  }

  render() {
    const { data, name } = this.props;
    return (
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Table className="table table-bordered table-hover" id={name}>
                {this.renderHeaders()}
                <Tbody id={name}>
                  {data && data.length > 0 ? this.renderRows() : this.renderNoDataToShow()}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  data: PropTypes.any.isRequired,
  columns: PropTypes.any.isRequired,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  onSelectAll: PropTypes.func,
  selectedData: PropTypes.any,
  primaryKey: PropTypes.string,
  name: PropTypes.string,
};

DMTable.propTypes = propTypes;

export default (withTranslation()(DMTable));
