import React, { Component } from 'react';
import { Label, Container, Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import DMTable from '../Table/DMTable';
import { TABLE_BOOT_VM_VMWARE } from '../../constants/TableConstants';
import { getValue } from '../../utils/InputUtils';
import DMField from '../Shared/DMField';

class DRPlanBootOrderStep extends Component {
  render() {
    const { dispatch, user, t } = this.props;
    const { values } = user;
    const selectedVMs = getValue('ui.site.seletedVMs', values);
    const dataToDisplay = Object.values(selectedVMs);
    return (
      <Container fluid className="padding-10">
        <Row>
          <Col sm={12} className="padding-top-10">
            <DMField dispatch={dispatch} user={user} fieldKey="drplan.bootDelay" />
          </Col>
        </Row>
        <Label>{t('Select Virtual Machine boot order')}</Label>
        <DMTable
          dispatch={dispatch}
          columns={TABLE_BOOT_VM_VMWARE}
          data={dataToDisplay}
          primaryKey="moref"
          user={user}
        />
      </Container>
    );
  }
}

export default (withTranslation()(DRPlanBootOrderStep));
