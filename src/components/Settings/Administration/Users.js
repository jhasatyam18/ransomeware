import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { API_USERS } from '../../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { TABLE_USERS } from '../../../constants/TableConstants';
import { hideApplicationLoader, showApplicationLoader } from '../../../store/actions';
import { addMessage } from '../../../store/actions/MessageActions';
import { callAPI } from '../../../utils/ApiUtils';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import DMTable from '../../Table/DMTable';

function Users(props) {
  const { dispatch } = props;
  const [userData, setUserData] = useState([]);
  const getUsers = () => {
    dispatch(showApplicationLoader(API_USERS, 'loading users'));
    callAPI(API_USERS).then((json) => {
      dispatch(hideApplicationLoader(API_USERS));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        setUserData(json);
      }
    },
    (err) => {
      dispatch(hideApplicationLoader(API_USERS));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };

  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      getUsers();
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
              <Row>
                <Col sm={12}>
                  <DMTable
                    columns={TABLE_USERS}
                    data={userData}
                    primaryKey="ID"
                    name="users"
                    dispatch={dispatch}
                  />
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
export default connect(mapStateToProps)(withTranslation()(Users));
