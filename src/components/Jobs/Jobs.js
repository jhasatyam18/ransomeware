import React, { Component, Suspense } from 'react';
import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { resetJobs } from '../../store/actions/JobActions';
import { JOBS_TABS, TAB_TYPE } from '../../constants/InputConstants';
import { JOBS } from '../../constants/RouterConstants';

const Replication = React.lazy(() => import('./Replication'));
const Recovery = React.lazy(() => import('./Recovery'));

class Jobs extends Component {
  constructor() {
    super();
    this.state = { activeTab: '1' };
    this.toggleTab = this.toggleTab.bind(this);
  }

  componentDidMount() {
    const { location, history } = this.props;
    const { search } = location;
    const tab = new URLSearchParams(search).get('tab');
    if (!tab) {
      history.push(`${JOBS}?tab=replication`);
      return;
    }
    if (tab === TAB_TYPE.RECOVERY) {
      this.toggleTab('2');
    } else {
      this.toggleTab('1');
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { search } = location;
    const tab = new URLSearchParams(search).get('tab');
    if (prevProps.location.search !== search) {
      if (tab === TAB_TYPE.RECOVERY) {
        this.toggleTab('2');
      } else {
        this.toggleTab('1');
      }
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetJobs());
  }

  getComponent(tab) {
    switch (tab.component) {
      case 'REPLICATION':
        return <Replication protectionplanID={0} {...this.props} />;
      case 'RECOVERY':
        return <Recovery protectionplanID={0} {...this.props} />;
      default:
        return <div>404</div>;
    }
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
    const { history } = this.props;
    const navs = JOBS_TABS.map((tab) => (
      <NavItem key={`jobs-navItem-${tab.activeTab}`}>
        <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === `${tab.activeTab}` })} onClick={() => { history.push(`${JOBS}?tab=${tab.title.toLowerCase()}`); }}>
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

  renderTabs() {
    const { activeTab } = this.state;
    return (
      <TabContent activeTab={activeTab}>
        {JOBS_TABS.map((tab) => (
          <TabPane tabId={`jobs-${tab.activeTab}`} className="p-3">
            <Row>
              <Col sm="12">
                {this.getComponent(tab)}
              </Col>
            </Row>
          </TabPane>
        ))}
      </TabContent>
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
                        {activeTab === '1' ? <Replication protectionplanID={null} {...this.props} /> : null}
                      </Suspense>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2" className="p-3">
                  <Row>
                    <Col sm="12">
                      <Suspense fallback={<div>Loading...</div>}>
                        {activeTab === '2' ? <Recovery protectionplanID={null} {...this.props} /> : null}
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

export default withRouter(Jobs);
