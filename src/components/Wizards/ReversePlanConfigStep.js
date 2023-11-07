import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Form } from 'reactstrap';
import { getValue } from '../../utils/InputUtils';
import DMField from '../Shared/DMField';

class ReversePlanConfigStep extends Component {
  render() {
    const { user, dispatch, t } = this.props;
    const { values } = user;
    const drPlan = getValue('ui.reverse.drPlan', values);
    let name = '';
    let protectedSiteName = '';
    if (drPlan) {
      name = drPlan.name;
      protectedSiteName = drPlan.protectedSite.name;
    }
    return (
      <>
        <Card className="padding-20">
          <CardTitle>{t('Reverse Protection Plan')}</CardTitle>
          <CardBody>
            <Form>
              <DMField dispatch={dispatch} user={user} fieldKey="reverse.name" text={name} />
              <DMField dispatch={dispatch} user={user} fieldKey="reverse.protectedSite" text={protectedSiteName} />
              <DMField dispatch={dispatch} user={user} fieldKey="reverse.recoverySite" />
            </Form>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default (withTranslation()(ReversePlanConfigStep));
