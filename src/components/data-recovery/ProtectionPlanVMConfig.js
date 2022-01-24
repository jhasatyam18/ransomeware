import React, { useState } from 'react';
import { Col, Form, Label, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { TABLE_PROTECTION_PLAN_VMS, TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';

function ProtectionPlanVMConfig(props) {
  const [viewProtection, setViewProtection] = useState(true);
  const { protectionPlan, dispatch, t } = props;
  const { protectedEntities, recoveryEntities } = protectionPlan;
  const { virtualMachines } = protectedEntities;
  const { instanceDetails } = recoveryEntities;

  const renderProtectedEntities = () => (
    <Col sm="12">
      <DMTable
        dispatch={dispatch}
        columns={TABLE_PROTECTION_PLAN_VMS}
        data={virtualMachines}
      />
    </Col>
  );

  const renderRecoveryEntities = () => (
    <Col sm="12">
      <DMTable
        dispatch={dispatch}
        columns={TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG}
        data={instanceDetails}
      />
    </Col>
  );

  const renderOptions = () => (
    <Form className="padding-left-25">
      <div className="form-check-inline">
        <Label className="form-check-label" for="plan-protected-entities-opt">
          <input type="radio" className="form-check-input" id="plan-protected-entities-opt" name="protectionVMDetails" checked={viewProtection} onChange={() => { setViewProtection(true); }} />
          {t('protected.entities')}
        </Label>
      </div>
      <div className="form-check-inline">
        <Label className="form-check-label" for="plan-recovery-entities-opt">
          <input type="radio" className="form-check-input" id="plan-recovery-entities-opt" name="protectionVMDetails" checked={!viewProtection} onChange={() => { setViewProtection(false); }} />
          {t('recovery.entities')}
        </Label>
      </div>
    </Form>
  );

  const render = () => (
    <Row>
      {renderOptions()}
      {viewProtection ? renderProtectedEntities() : renderRecoveryEntities()}
    </Row>
  );

  return render();
}

export default (withTranslation()(ProtectionPlanVMConfig));
