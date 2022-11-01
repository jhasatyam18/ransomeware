import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Form } from 'reactstrap';
import { convertMinutesToDaysHourFormat } from '../../utils/AppUtils';
import { getValue } from '../../utils/InputUtils';
import DMField from '../Shared/DMField';

class ReversePlanConfigStep extends Component {
  render() {
    const { user, dispatch, t } = this.props;
    const { values } = user;
    const drPlan = getValue('ui.reverse.drPlan', values);
    let name = '';
    let replicationInterval = '';
    let protectedSiteName = '';
    if (drPlan) {
      name = drPlan.name;
      replicationInterval = drPlan.replicationInterval;
      protectedSiteName = drPlan.protectedSite.name;
    }
    const interval = convertMinutesToDaysHourFormat(replicationInterval);
    return (
      <>
        <Card className="padding-20">
          <CardTitle>{t('Reverse Protection Plan')}</CardTitle>
          <CardBody>
            <Form>
              <DMField dispatch={dispatch} user={user} fieldKey="reverse.name" text={name} />
              <DMField dispatch={dispatch} user={user} fieldKey="reverse.protectedSite" text={protectedSiteName} />
              <DMField dispatch={dispatch} user={user} fieldKey="reverse.recoverySite" />
              <DMField dispatch={dispatch} user={user} fieldKey="reverse.replType" />
              <DMField dispatch={dispatch} user={user} fieldKey="reverse.suffix" />
              <DMField dispatch={dispatch} user={user} fieldKey="reverse.interval" text={interval} />
            </Form>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default (withTranslation()(ReversePlanConfigStep));
