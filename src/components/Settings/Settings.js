import React, { Component, Suspense } from 'react';
import {
  Card,
  CardBody,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { SETTINGS_TABS } from '../../constants/InputConstants';
import Support from '../support/Support';

class Settings extends Component {
  constructor() {
    super();
    this.state = { activeTab: '1' };
    this.toggleTab = this.toggleTab.bind(this);
  }

  toggleTab(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  renderNav() {
    const { activeTab } = this.state;
    const navs = SETTINGS_TABS.map((tab) => (
      <NavItem key={`settings-navItem-${tab.activeTab}`}>
        <NavLink
          style={{ cursor: 'pointer' }}
          className={classnames({ active: activeTab === `${tab.activeTab}` })}
        >
          <span className="d-none d-sm-block">{tab.title}</span>
        </NavLink>
      </NavItem>
    ));
    return (
      <Nav tabs className="nav-tabs-custom nav-justified">
        {navs}
      </Nav>
    );
  }

  render() {
    const { activeTab } = this.state;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              {this.renderNav()}
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className="p-3">
                  <Row>
                    <Col sm="12">
                      <Suspense fallback={<div>Loading...</div>}>
                        {activeTab === '1' ? <Support /> : null}
                      </Suspense>
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

export default withRouter(Settings);
