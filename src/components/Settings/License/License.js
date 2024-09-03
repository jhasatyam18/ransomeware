import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Row } from 'reactstrap';
import { MODAL_INSTALL_NEW_LICENSE } from '../../../constants/Modalconstant';
import { TABLE_LICENSES } from '../../../constants/TableConstants';
import { fetchLicenses } from '../../../store/actions/LicenseActions';
import { openModal } from '../../../store/actions/ModalActions';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
import ActionButton from '../../Common/ActionButton';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import DMTable from '../../Table/DMTable';

function License(props) {
  const { dispatch, t, settings, user } = props;
  const { licenses = [] } = settings;
  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      dispatch(fetchLicenses());
    }
    return () => {
      isUnmounting = true;
    };
  }, []);

  function openInstallNewModal() {
    const options = { title: 'Install New License', css: 'modal-lg' };
    dispatch(openModal(MODAL_INSTALL_NEW_LICENSE, options));
  }

  return (
    <>
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <DMBreadCrumb links={[{ label: 'license', link: '#' }]} />
              <Row className="padding-left-30">
                <ActionButton label="New" onClick={openInstallNewModal} icon={faPlus} isDisabled={!hasRequestedPrivileges(user, ['license.create'])} t={t} key="newLicense" />
              </Row>
              <DMTable
                dispatch={dispatch}
                columns={TABLE_LICENSES}
                data={licenses}
                primaryKey="ID"
                name="licenses"
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
  const { user, settings } = state;
  return { user, settings };
}
export default connect(mapStateToProps)(withTranslation()(License));
