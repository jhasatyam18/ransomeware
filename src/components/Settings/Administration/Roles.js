import React, { useEffect, useState } from 'react';
import { Table, Tr, Th, Tbody, Td } from 'react-super-responsive-table';
import { Card, Container, CardBody, Row, Col, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import { hideApplicationLoader, showApplicationLoader } from '../../../store/actions';
import { addMessage } from '../../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { API_ROLES } from '../../../constants/ApiConstants';
import { callAPI } from '../../../utils/ApiUtils';

function Roles(props) {
  const { dispatch, t } = props;
  const [roles, setRoles] = useState([]);
  const [activeRoleID, setActiveRoleID] = useState(1);
  const [activeTab, setActiveTab] = useState('1');
  const [privileges, setPrivileges] = useState([]);
  const [roleUsers, setRoleUsers] = useState([]);

  const setSelectedRoleData = (id) => {
    roles.forEach((role) => {
      if (role.id === id) {
        setActiveRoleID(id);
        setPrivileges(role.privileges);
        setRoleUsers(role.users);
      }
    });
  };

  const fetchRoles = () => {
    dispatch(showApplicationLoader(API_ROLES, 'loading roles'));
    callAPI(API_ROLES).then((json) => {
      dispatch(hideApplicationLoader(API_ROLES));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        setRoles(json);
        if (json && json.length > 0) {
          const role = json[0];
          if (role) {
            setActiveRoleID(role.id);
            setPrivileges(role.privileges);
            setRoleUsers(role.users);
          }
        }
      }
    },
    (err) => {
      dispatch(hideApplicationLoader(API_ROLES));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };

  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      fetchRoles();
    }
    return () => {
      isUnmounting = true;
    };
  }, []);

  const renderRoles = () => (
    <Table className="table table-bordered">
      <Tbody>
        {roles.map((role) => (
          <tr key={`role-${role.id}`} className={activeRoleID === role.id ? 'selected_role' : ''}>
            <td>
              <a href="#" onClick={() => setSelectedRoleData(role.id)}>
                {role.name}
              </a>
            </td>
          </tr>
        ))}
      </Tbody>
    </Table>
  );

  const renderUsers = () => (
    <Table className="table table-bordered">
      <Tbody>
        <Tr>
          <Th>{t('username')}</Th>
          <Th>{t('description')}</Th>
        </Tr>
        {roleUsers.map((u) => (
          <Tr key={`user-${u.id}`}>
            <Td>
              {u.username}
            </Td>
            <Td>
              {u.description}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  const renderPrivileges = () => (
    <Table className="table table-bordered">
      <Tbody>
        {privileges.map((u) => (
          <Tr key={`privilege-${u.id}`}>
            <Td>
              {u.name}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return (
    <>
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <DMBreadCrumb links={[{ label: 'roles', link: '#' }]} />
              <Row>
                <Col sm={4}>
                  {renderRoles()}
                </Col>
                <Col sm={8}>
                  <Nav pills className="navtab-bg nav-justified">
                    <NavItem>
                      <NavLink className={`${classnames({ active: activeTab === '1' })} cursor-pointer`} onClick={() => { setActiveTab('1'); }}>
                        <span className="d-none d-sm-block">{t('privileges')}</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink className={`${classnames({ active: activeTab === '2' })} cursor-pointer`} onClick={() => { setActiveTab('2'); }}>
                        <span className="d-none d-sm-block">{t('users')}</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1" className="p-3">
                      <Row>
                        <Col sm="12">
                          <SimpleBar className="roles_simplebar">
                            {renderPrivileges()}
                          </SimpleBar>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2" className="p-3">
                      <Row>
                        <Col sm="12">
                          {renderUsers()}
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </>
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(Roles));
