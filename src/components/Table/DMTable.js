import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Card, CardBody,
} from 'reactstrap';
import {
  Table, Thead, Tr, Th, Tbody, Td,
} from 'react-super-responsive-table';
import { withTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import DMTableRow from './DMTableRows';

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
    const { onSelectAll, dispatch } = this.props;
    this.setState({ selected: e.target.checked });
    dispatch(onSelectAll(e.target.checked));
  }

  renderHeaderLables(columns) {
    const { t } = this.props;
    return columns
      .map((col) => (
        <Th key={col.lable}>
          {' '}
          {t(col.label)}
          {' '}
        </Th>
      ));
  }

  renderCheckBoxPlaceHolder() {
    const { isSelectable, name } = this.props;
    const { selected } = this.state;
    if (isSelectable && name) {
      return (
        <Th style={{ width: 10 }}>
          <div className="custom-control custom-checkbox" key="global-select">
            <input
              type="checkbox"
              className="custom-control-input"
              id={`chk-${name}`}
              checked={selected}
              onChange={this.onChange}
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
      />
    ));
  }

  render() {
    const { data } = this.props;
    return (
      <Row>
        <Col>
          <Card>
            <CardBody>
              <SimpleBar style={{ minHeight: 400, maxHeight: 550 }}>
                <Table className="table table-bordered">
                  {this.renderHeaders()}
                  <Tbody>
                    {data && data.length > 0 ? this.renderRows() : this.renderNoDataToShow()}
                  </Tbody>
                </Table>
              </SimpleBar>
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
