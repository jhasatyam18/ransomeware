import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { TABLE_PROTECT_VM_VMWARE } from '../../constants/TableConstants';
import { getStorageWithUnit } from '../../utils/AppUtils';
import { getValue } from '../../utils/InputUtils';
import DMTable from '../Table/DMTable';

class RecoverySummary extends Component {
  getRecoveryType() {
    const { user } = this.props;
    const { values } = user;
    const type = getValue('ui.isMigration.workflow', values);
    if (type) {
      return 'Migration';
    }
    const dryRun = getValue('recovery.dryrun', values);
    return (dryRun ? 'TEST' : 'FULL');
  }

  renderAutoMigrationWarning() {
    const { t } = this.props;
    return (
      <p className="text-warning">
        {t('info.auto.migration.note')}
        <br />
        {t('info.auto.migration.step-1')}
        <br />
        {t('info.auto.migration.step-2')}
        <br />
        {t('info.auto.migration.step-3')}
      </p>
    );
  }

  render() {
    const { dispatch, user } = this.props;
    const { values } = user;
    const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
    const protectionplanID = getValue('recovery.protectionplanID', values);
    const selectedDrPlan = getValue('ui.values.drplan', values).filter((plan) => `${plan.id}` === `${protectionplanID}`)[0];
    const data = [];
    const { name } = selectedDrPlan;
    const type = getValue('ui.isMigration.workflow', values);
    const summaryTitle = type ? 'Migration Summary' : 'Recovery Summary';
    const isAutoMigrate = getValue('ui.automate.migration', values);
    let size = 0;
    Object.keys(selectedVMs).forEach((key) => {
      data.push(selectedVMs[key]);
      selectedVMs[key].virtualDisks.forEach((disk) => {
        if ((typeof selectedVMs[key].isDeleted !== 'undefined' && selectedVMs[key].isDeleted) || (typeof disk.isDeleted !== 'undefined' && !disk.isDeleted && typeof disk.size !== 'undefined')) {
          size += disk.size;
        }
      });
    });
    size = getStorageWithUnit(size);
    return (
      <>
        <Card className="padding-20">
          <CardTitle>{summaryTitle}</CardTitle>
          <CardBody>
            <Row>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Plan</Col>
                  <Col sm={3}>{name}</Col>
                  <Col sm={3} className="text-muted">Recovery Type</Col>
                  <Col sm={3}>{this.getRecoveryType()}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Virtual Machines</Col>
                  <Col sm={3}>{data.length}</Col>
                  <Col sm={3} className="text-muted">Total Size</Col>
                  <Col sm={3}>{size}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
            </Row>
          </CardBody>
          { isAutoMigrate ? this.renderAutoMigrationWarning() : null }
          <DMTable
            dispatch={dispatch}
            columns={TABLE_PROTECT_VM_VMWARE}
            data={data}
          />
        </Card>
      </>
    );
  }
}

export default (withTranslation()(RecoverySummary));
