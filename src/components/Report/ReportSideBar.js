import React from 'react';
import { Col, Label, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMField from '../Shared/DMField';
import { FIELDS } from '../../constants/FieldsConstant';

function ReportSideBar(props) {
  const { user, dispatch, t, showFormat } = props;
  function renderFields(fields) {
    return (
      <Row>
        {
          fields
        }
      </Row>
    );
  }

  function renderProtectionPlanOptions(filterKey) {
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf(filterKey) !== -1);
    const rFields = [];
    fields.forEach((field) => {
      const disabled = (field === 'report.system.includeSystemOverView');
      rFields.push(
        (
          <Col sm={4}>
            <DMField dispatch={dispatch} user={user} fieldKey={field} key={`rpt-${field}`} disabled={disabled} />
          </Col>),
      );
    });
    return renderFields(rFields);
  }

  function renderPlanOtions() {
    return (
      <Row>
        <Col sm={4}>
          <DMField dispatch={dispatch} user={user} fieldKey="report.protectionPlan.protectionPlans" key="rpt-report.protectionPlan.protectionPlans" />
        </Col>
        <Col sm={4}>
          <DMField dispatch={dispatch} user={user} fieldKey="report.protectionPlan.includeProtectedVMS" key="rpt-report.protectionPlan.includeProtectedVMS" />
        </Col>
        <Col sm={4}>
          <DMField dispatch={dispatch} user={user} fieldKey="report.protectionPlan.includeCheckpoints" key="rpt-report.protectionPlan.includeCheckpoints" />
        </Col>
        <Col sm={4}>
          <DMField dispatch={dispatch} user={user} fieldKey="report.protectionPlan.includeReplicationJobs" key="rpt-report.protectionPlan.includeReplicationJobs" />
        </Col>
        <Col sm={6}>
          <DMField dispatch={dispatch} user={user} fieldKey="report.protectionPlan.replJobOption" key="rpt-report.protectionPlan.replJobOption" hideLabel />
        </Col>
        <Col sm={4}>
          <DMField dispatch={dispatch} user={user} fieldKey="report.protectionPlan.includeRecoveryJobs" key="rpt-report.protectionPlan.includeRecoveryJobs" />
        </Col>
        <Col sm={6}>
          <DMField dispatch={dispatch} user={user} fieldKey="report.protectionPlan.recoveryJobOption" key="rpt-report.protectionPlan.recoveryJobOption" hideLabel />
        </Col>
      </Row>
    );
  }

  return (
    <>
      <Label className="text-muted">{t('report.system')}</Label>
      <div>
        {renderProtectionPlanOptions('report.system')}
      </div>
      <hr />
      <Label className="text-muted">{t('protection.plans')}</Label>
      <div>
        {renderPlanOtions()}
      </div>
      <hr />
      {!showFormat && <Label className="text-muted mt-2">{t('report.duration.heading')}</Label>}
      <div>
        {renderProtectionPlanOptions(`${showFormat ? 'report.format' : 'report.duration'}`)}
      </div>
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ReportSideBar));
