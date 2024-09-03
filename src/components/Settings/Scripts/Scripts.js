import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Container, Row } from 'reactstrap';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import ActionButton from '../../Common/ActionButton';
import DMTable from '../../Table/DMTable';
import { addMessage } from '../../../store/actions/MessageActions';
import { openModal } from '../../../store/actions/ModalActions';
import { hideApplicationLoader, showApplicationLoader } from '../../../store/actions';
import { API_USER_SCRIPT } from '../../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { TABLE_UPLOAD_SCRIPTS } from '../../../constants/TableConstants';
import { callAPI } from '../../../utils/ApiUtils';
import { MODAL_USER_SCRIPT } from '../../../constants/Modalconstant';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';

function Scripts(props) {
  const { t, dispatch, user } = props;
  const [data, setData] = useState([]);
  const refresh = useSelector((state) => state.user.context.refresh);

  useEffect(() => {
    let isUnmounting = false;
    dispatch(showApplicationLoader(API_USER_SCRIPT, 'loading...'));
    setData([]);
    callAPI(API_USER_SCRIPT)
      .then((json) => {
        if (isUnmounting) return;
        setData(json);
        dispatch(hideApplicationLoader(API_USER_SCRIPT));
      },
      (err) => {
        if (isUnmounting) return;
        setData([]);
        dispatch(hideApplicationLoader(API_USER_SCRIPT));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
    return () => {
      isUnmounting = true;
    };
  }, [refresh]);

  const onNewScript = () => {
    const options = { title: 'Script' };
    dispatch(openModal(MODAL_USER_SCRIPT, options));
  };

  return (
    <>
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <DMBreadCrumb links={[{ label: 'scripts', link: '#' }]} />
              <Row className="padding-left-30">
                <ActionButton isDisabled={!hasRequestedPrivileges(user, ['script.create'])} label="New" onClick={onNewScript} icon={faPlus} t={t} key="newScript" id="newScript" />
              </Row>
              <DMTable
                dispatch={dispatch}
                columns={TABLE_UPLOAD_SCRIPTS}
                data={data}
                primaryKey="ID"
                name="scripts"
                user={user}
              />
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
export default connect(mapStateToProps)(withTranslation()(Scripts));
