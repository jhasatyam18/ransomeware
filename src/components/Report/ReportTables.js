import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import DMTable from '../Table/DMTable';
import DMTPaginator from '../Table/DMTPaginator';

class ReportTables extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [], isOpen: false };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  toggle() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  renderIcon() {
    const { isOpen } = this.state;
    return (
      <div className="wizard-header-options">
        <div className="wizard-header-div">
          {isOpen ? <box-icon name="chevron-down" color="white" onClick={this.toggle} style={{ height: 20 }} />
            : <box-icon name="chevron-right" color="white" onClick={this.toggle} style={{ height: 20 }} />}
        </div>
      </div>
    );
  }

  renderPaginator() {
    const { reports, dataSource, columns } = this.props;
    const { result } = reports;
    const data = (typeof result[dataSource] !== 'undefined' ? result[dataSource] : []);
    return (
      <Row className="padding-left-20">
        <Col sm={12}>
          <div className="padding-right-30 padding-left-10">
            <DMTPaginator
              data={data}
              setData={this.setDataForDisplay}
              columns={columns}
            />
          </div>
        </Col>
      </Row>
    );
  }

  renderTable() {
    const { reports, dataSource, dispatch, user, columns, title, printView } = this.props;
    const { result } = reports;
    const data = (typeof result[dataSource] !== 'undefined' ? result[dataSource] : []);
    const { dataToDisplay } = this.state;
    const name = `rpt-${title.toLowerCase().split(' ').join('_')}`;
    return (
      <div>
        { printView === false ? this.renderPaginator() : null }
        <Row>
          <Col sm={12}>
            <DMTable
              dispatch={dispatch}
              columns={columns}
              data={printView === false ? data : dataToDisplay}
              primaryKey="id"
              name={name}
              user={user}
            />
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const { reports, dataSource, title, printView } = this.props;
    const { result } = reports;
    const data = result[dataSource];
    const { isOpen } = this.state;
    if (!data || data.length === 0) {
      return null;
    }
    return (
      <div key={`dm-accordion-${title}`}>
        <Card className="margin-bottom-10">
          <CardHeader>
            <Row>
              <Col sm={6}>
                <span aria-hidden className="link_color" onClick={this.toggle}>
                  {title}
                </span>
              </Col>
              <Col sm={6} className="d-flex flex-row-reverse">
                {this.renderIcon()}
              </Col>
            </Row>
            <Collapse isOpen={isOpen || printView}>
              <CardBody className="padding-left-0 paddings-right-0">
                {this.renderTable()}
              </CardBody>
            </Collapse>
          </CardHeader>
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { reports, user } = state;
  return { reports, user };
}

export default connect(mapStateToProps)(withTranslation()(ReportTables));
