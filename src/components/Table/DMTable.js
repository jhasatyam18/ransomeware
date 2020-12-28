import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Card, CardBody,
} from 'reactstrap';
import {
  Table, Thead, Tr, Th, Tbody,
} from 'react-super-responsive-table';

import DMTableRow from './DMTableRows';

class DMTable extends Component {
  renderHeaderLables(columns) {
    return columns
      .map((col) => (
        <Th key={col.lable}>
          {' '}
          {col.label}
          {' '}
        </Th>
      ));
  }

  renderCheckBoxPlaceHolder() {
    const { isSelectable } = this.props;
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
        <Th colSpan={Object.keys(columns).length + 1}> No Data To Display</Th>
      </Tr>
    );
  }

  renderRows() {
    const {
      dispatch, data, columns, isSelectable, onSelect, selectedData, primaryKey,
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
              <Table className="table table-bordered">
                {this.renderHeaders()}
                <Tbody>
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
  isSelectable: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedData: PropTypes.any.isRequired,
  primaryKey: PropTypes.string,
};

DMTable.propTypes = propTypes;

export default DMTable;
