import React from 'react';
import { Form, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMField from '../Shared/DMField';
import { FIELDS } from '../../constants/FieldsConstant';

function ReportSideBar(props) {
  function renderFields(fields) {
    return (
      <Form>
        {
          fields
        }
      </Form>
    );
  }

  function renderProtectionPlanOptions(filterKey) {
    const { user, dispatch } = props;
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf(filterKey) !== -1);
    const rFields = [];
    fields.forEach((field) => {
      rFields.push((<DMField dispatch={dispatch} user={user} fieldKey={field} key={`rpt-${field}`} />));
    });
    return renderFields(rFields);
  }

  return (
    <>
      <Label className="text-muted">System</Label>
      <div className="padding-left-10">
        {renderProtectionPlanOptions('report.system')}
      </div>
      <hr />
      <Label className="text-muted">Protection Plans</Label>
      <div className="padding-left-10">
        {renderProtectionPlanOptions('report.protectionPlan')}
      </div>
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ReportSideBar));
