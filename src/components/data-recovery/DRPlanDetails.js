import React, { Component } from 'react';
import { Card, Container, CardBody, Row, Col, CardTitle, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { fetchDRPlanById } from '../../store/actions/DrPlanActions';
import DMTable from '../Table/DMTable';
import { TABLE_PROTECT_VM_VMWARE } from '../../constants/TableConstants';

class DRPlanDetails extends Component {
  constructor() {
    super();
    this.state = { activeTab: '1' };
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { pathname } = location;
    const parts = pathname.split('/');
    this.toggleTab = this.toggleTab.bind(this);
    dispatch(fetchDRPlanById(parts[parts.length - 1]));
  }

  toggleTab(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  renderSite(site) {
    if (!site || !site.platformDetails) {
      return null;
    }
    const { platformDetails } = site;
    const keys = [{ label: 'Name', field: 'platformName' }, { label: 'Platfrom Type', field: 'platformType' }, { label: 'Hostname', field: 'hostname' }, { label: 'Port', field: 'port' },
      { label: 'Region', field: 'region' }, { label: 'Zone', field: 'availZone' }, { label: 'Project ID', field: 'projectId' }, { label: 'Datamotive Server IP', field: 'serverIp' },
      { label: 'Datamotive Server Port', field: 'serverPort' }, { label: 'Machine IP', field: 'prepMachineIP' }];
    const fields = keys.map((ele) => {
      const { field, label } = ele;
      if (platformDetails[field]) {
        return (
          <div className="stack__info">
            <div className="label">
              {label}
            </div>
            <div className="value">
              {platformDetails[field]}
            </div>
          </div>

        );
      }
      return null;
    });
    return fields;
  }

  renderRecoveryConfig(config) {
    if (!config || !config.instanceDetails) {
      return null;
    }
    const { instanceDetails } = config;
    const keys = [{ label: 'AMIID', field: 'amiID' }, { label: 'Instance Type', field: 'instanceType' }, { label: 'Availability Zone', field: 'availabilityZone' }, { label: 'Volume Type', field: 'volumeType' }];
    const fields = keys.map((ele) => {
      const { field, label } = ele;
      if (instanceDetails[field]) {
        return (
          <div className="stack__info">
            <div className="label">
              {label}
            </div>
            <div className="value">
              {instanceDetails[field]}
            </div>
          </div>

        );
      }
      return null;
    });
    return fields;
  }

  render() {
    const { drPlans, dispatch } = this.props;
    const { details } = drPlans;
    const { activeTab } = this.state;
    if (!details || Object.keys(details).length === 0) {
      return null;
    }
    const { name, protectedSite, recoverySite, protectedEntities, recoveryEntities } = details;
    const { VirtualMachines } = protectedEntities;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <CardTitle className="mb-4">
                Protection Plan : &nbsp;&nbsp;
                {name}
              </CardTitle>
              <Row>
                <Col sm={5}>
                  <CardTitle>Protected Site</CardTitle>
                  <Card>
                    {this.renderSite(protectedSite)}
                  </Card>
                </Col>
                <Col sm={2}>
                  <div className="stack__info">
                    <div className="line" />
                  </div>
                </Col>
                <Col sm={5}>
                  <CardTitle>Recovery Site</CardTitle>
                  {this.renderSite(recoverySite)}
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Nav tabs className="nav-tabs-custom nav-justified">
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                    <span className="d-none d-sm-block">Protected Virtual Machines</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
                    <span className="d-none d-sm-block">Recovery Configuration</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '3' })} onClick={() => { this.toggleTab('3'); }}>
                    <span className="d-none d-sm-block">Replications</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className="p-3">
                  <Row>
                    <Col sm="12">
                      <DMTable
                        dispatch={dispatch}
                        columns={TABLE_PROTECT_VM_VMWARE}
                        data={VirtualMachines}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2" className="p-3">
                  <Row>
                    <Col sm="4">
                      {this.renderRecoveryConfig(recoveryEntities)}
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="3" className="p-3">
                  <Row>
                    <Col sm="12">
                      3
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}
export default DRPlanDetails;
