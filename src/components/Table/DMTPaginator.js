import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Row } from 'reactstrap';

class DMTPaginator extends Component {
  constructor() {
    super();
    this.state = { totalRows: 0, disablePrivious: false, disableNext: false, index: 0, maxRowPerPage: 100 };
    this.onNext = this.onNext.bind(this);
    this.onBack = this.onBack.bind(this);
    this.filterData = this.filterData.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data.length !== prevState.totalRows) {
      const { data, setData } = nextProps;
      const { maxRowPerPage } = prevState;
      const dataToShow = data.slice(0, 0 + maxRowPerPage);
      setData(dataToShow);
      return ({ index: 0 + maxRowPerPage, totalRows: data.length, maxRowPerPage: 100, disablePrivious: true, disableNext: !(data.length > maxRowPerPage) });
    }
    return null;
  }

  onNext() {
    const { index, maxRowPerPage } = this.state;
    const { setData, data } = this.props;
    if (index < data.length) {
      const dataToShow = data.slice(index, index + maxRowPerPage);
      this.setState({ index: index + maxRowPerPage, disableNext: !(data.length > index + maxRowPerPage), disablePrivious: !(index + maxRowPerPage > maxRowPerPage) });
      setData(dataToShow);
    }
  }

  onBack() {
    const { index, maxRowPerPage } = this.state;
    const { setData, data } = this.props;
    const strat = index - (maxRowPerPage * 2);
    const dataToShow = data.slice(strat, index - maxRowPerPage);
    this.setState({ index: index - maxRowPerPage, disableNext: !(data.length > index - maxRowPerPage), disablePrivious: !(index - maxRowPerPage > maxRowPerPage) });
    setData(dataToShow);
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

  filter(d, columns, userValue) {
    let hasMatchingRow = false;
    columns.forEach((value) => {
      const { itemRenderer, field } = value;
      if (!itemRenderer) {
        const val = this.getObjectValue(d, field);
        if (val && `${val}`.indexOf(userValue) !== -1) {
          hasMatchingRow = true;
        }
      }
    });
    return hasMatchingRow;
  }

  filterData(e) {
    const { data, columns, setData } = this.props;
    const { target } = e;
    const { value } = target;
    const filteredData = data.filter((d) => this.filter(d, columns, value));
    setData(filteredData);
  }

  renderFilter() {
    const { showFilter } = this.props;
    if (showFilter === true) {
      return (
        <div className="col-auto">
          <label className="sr-only" htlmFor="datableSearch" />
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              id="datableSearch"
              placeholder="Search"
              onChange={(e) => this.filterData(e)}
            />
          </div>
        </div>
      );
    }
  }

  render() {
    const { disablePrivious, disableNext, maxRowPerPage } = this.state;
    const { totalRows, index } = this.state;
    const tPages = Math.ceil(totalRows / maxRowPerPage);
    const cP = (index > 0 ? Math.ceil(index / maxRowPerPage) : 0);
    return (
      <>
        <Row>
          <Col sm={12}>
            <ButtonGroup style={{ paddingLeft: 20 }} className="btn-group-sm">
              <Button disabled={disablePrivious} onClick={this.onBack}>
                <box-icon type="solid" name="chevron-left" size="xs" />
              </Button>
              <Button>
                Page
                &nbsp;&nbsp;
                {cP}
                 &nbsp;&nbsp;
                of
                &nbsp; &nbsp;
                {tPages}
              </Button>
              <Button disabled={disableNext} onClick={this.onNext}>
                <box-icon type="solid" name="chevron-right" size="xs" />
              </Button>

            </ButtonGroup>
          </Col>
          <Col sm={4}>
            {this.renderFilter()}
          </Col>
        </Row>

      </>
    );
  }
}

export default DMTPaginator;
