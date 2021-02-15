import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import { getValue } from '../../utils/InputUtils';

class ProtectionPlanSummaryStep extends Component {
  render() {
    const { user, t } = this.props;
    const { values } = user;
    const name = getValue('drplan.name', values);
    const pSite = getValue('drplan.protectedSite', values);
    const rSite = getValue('drplan.recoverySite', values);
    const replicationInterval = getValue('drplan.replicationInterval', values);
    const protectedSiteName = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${pSite}`)[0].platformDetails.platformName;
    const recoverySiteName = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${rSite}`)[0].platformDetails.platformName;
    const selectedVMs = getValue('ui.site.seletedVMs', values);
    const replicationUnit = getValue('ui.values.replication.interval.type', values);
    let size = 0;
    Object.keys(selectedVMs).forEach((key) => {
      selectedVMs[key].virtualDisks.forEach((disk) => {
        size += disk.size;
      });
    });
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
                  <Col sm={3}>{`${size} GB`}</Col>
                </Row>
                <hr className="mt-3 mb-3" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default (withTranslation()(ProtectionPlanSummaryStep));
