import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { fetchUsers } from '../../../store/actions';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import { fetchRoles } from '../../../store/actions/RolesAction';
import UsersTable from './UsersTable';
import UserActionButtons from './UserActionButtons';

function Users(props) {
  const { dispatch, settings, user } = props;
  const { roles } = user;
  const { selectedUsers } = settings;

  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      dispatch(fetchUsers());
      dispatch(fetchRoles());
    }
    return () => {
      isUnmounting = true;
    };
  }, []);

  return (
    <>
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <DMBreadCrumb links={[{ label: 'users', link: '#' }]} />
              <UserActionButtons user={user} dispatch={dispatch} selectedUsers={selectedUsers} roles={roles} />
              <Row>
                <Col sm={12}>
                  <UsersTable user={user} dispatch={dispatch} settings={settings} />
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
  const { settings, user } = state;
  return { settings, user };
}
export default connect(mapStateToProps)(withTranslation()(Users));
