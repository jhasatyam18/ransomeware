import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { TABLE_ALERTS } from '../../constants/TableConstants';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { convertMinutesToDaysHourFormat, getStorageWithUnit } from '../../utils/AppUtils';
import { getValue } from '../../utils/InputUtils';

class ProtectionPlanSummaryStep extends Component {
  renderAlerts() {
    const { user, t } = this.props;
    const { values } = user;
    const isEventAction = getValue('ui.isEventAction', values);
    const alerts = getValue('ui.vm.alerts', values);
    if (isEventAction === true) {
      const fields = ['title', 'severity', 'updatedTime'];
      const cols = TABLE_ALERTS.filter((c) => fields.indexOf(c.field) !== -1);
      return (
        <Col sm={12} className="text-warning padding-top-10">
          <div>{t('vm.alerts.warning')}</div>
          <DMTable
            columns={cols}
            data={alerts}
            primaryKey="id"
          />
        </Col>
      );
    }
  }

  render() {
    const { user, t } = this.props;
    const { values } = user;
    const name = getValue('drplan.name', values);
    const pSite = getValue('drplan.protectedSite', values);
    const rSite = getValue('drplan.recoverySite', values);
    const replicationInterval = `Every ${convertMinutesToDaysHourFormat(getValue('drplan.replicationInterval', values))}`;
    const protectedSiteName = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${pSite}`)[0].name;
    const recoverySiteName = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${rSite}`)[0].name;
    const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
    const replicationUnit = getValue('ui.values.replication.interval.type', values);
    let size = 0;
    Object.keys(selectedVMs).forEach((key) => {
      if (typeof selectedVMs[key].virtualDisks !== 'undefined' && selectedVMs[key].virtualDisks !== null) {
        selectedVMs[key].virtualDisks.forEach((disk) => {
          if (!disk.isDeleted) {
            size += disk.size;
          }
        });
      }
    });
    size = getStorageWithUnit(size);
    return (
      <>
        <Card className="padding-20">
          <CardTitle>{t('Summary')}</CardTitle>
          <CardBody>
            <Row>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Name</Col>
                  <Col sm={3}>{name}</Col>
                  <Col sm={3} className="text-muted">Replication Interval</Col>
                  <Col sm={3}>
                    {replicationInterval}
                    {' '}
                    {replicationUnit}
                  </Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Protected Site</Col>
                  <Col sm={3}>{protectedSiteName}</Col>
                  <Col sm={3} className="text-muted">Recover Site</Col>
                  <Col sm={3}>{recoverySiteName}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
              <Col sm={12}>
                <Row>
                  <Col sm={3} className="text-muted">Virtual Machines</Col>
                  <Col sm={3}>{Object.keys(selectedVMs).length}</Col>
                  <Col sm={3} className="text-muted">Total Storage</Col>
                  <Col sm={3}>{size}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
              {this.renderAlerts()}
            </Row>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default (withTranslation()(ProtectionPlanSummaryStep));
