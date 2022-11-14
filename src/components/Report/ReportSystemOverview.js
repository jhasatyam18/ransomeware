import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader, Col, Collapse, Media, Row } from 'reactstrap';
import { getStorageWithUnit } from '../../utils/AppUtils';
import RtoRpo from '../Dashboard/RtoRpo';

class ReportSystemOverview extends Component {
  constructor() {
    super();
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  recoveryStats() {
    return (
      <RtoRpo />
    );
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

  renderTitles() {
    const { dashboard } = this.props;
    const { titles } = dashboard;
    const { sites, vms, storage, protectionPlans } = titles;
    const data = [
      { title: 'Sites', icon: 'cloud', description: sites },
      { title: 'Protection Plans', icon: 'layer', description: protectionPlans },
      { title: 'Protected Machines', icon: 'desktop', description: vms },
      { title: 'Storage', icon: 'hdd', description: getStorageWithUnit(storage) },
    ];
    return (
      <div key="rpt-system-overview" id="rpt-system-overview">
        <Row>
          {data.map((report, key) => (
            <Col md="3" key={`_col_-${key * 2}`}>
              <Media className="rpt__system__overview">
                <Media body>
                  <p className="text-muted font-weight-medium title__cards">
                    {report.title}
                  </p>
                  <h4 className="mb-0 title__values">{report.description}</h4>
                </Media>

                <span className="align-self-center">
                  <box-icon name={report.icon} size="lg" color={report.color ? report.color : 'white'} />
                </span>
              </Media>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  renderData() {
    return (
      <>
        {this.renderTitles()}
        {this.recoveryStats()}
      </>
    );
  }

  render() {
    const { dashboard } = this.props;
    const { titles } = dashboard;
    if (!titles) {
      return null;
    }
    const { sites, vms, storage } = titles;
    if (sites === 0 && vms === 0 && storage === 0) {
      return null;
    }
    const { isOpen } = this.state;
    const title = 'System Overview';
    return (
      <div key={`dm-accordion-${title}`}>
        <Card className="margin-bottom-10">
          <CardHeader>
            <Row>
              <Col sm={6}>
                <a href="#" onClick={this.toggle}>
                  {title}
                </a>
              </Col>
              <Col sm={6} className="d-flex flex-row-reverse">
                {this.renderIcon()}
              </Col>
            </Row>
            <Collapse isOpen={isOpen}>
              <CardBody className="padding-left-0 paddings-right-0">
                {this.renderData()}
              </CardBody>
            </Collapse>
          </CardHeader>
        </Card>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { reports, dashboard } = state;
  return { reports, dashboard };
}

export default connect(mapStateToProps)(withTranslation()(ReportSystemOverview));
