import React from 'react';
import { Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
// Simple bar
import SimpleBar from 'simplebar-react';
import { connect } from 'react-redux';
import { getValue } from '../../utils/InputUtils';
import { STATIC_KEYS } from '../../constants/InputConstants';
import DateItemRenderer from '../Table/ItemRenderers/DateItemRenderer';
import { KEY_CONSTANTS } from '../../constants/UserConstant';

const WinPrepUpdateWarningMsg = ({ options, user, dispatch, t, drPlans }) => {
  const { data, selectedVms } = options;
  const { values } = user;
  const { protectionPlan } = drPlans;
  const { recoveryPointConfiguration } = protectionPlan;
  const { isRecoveryCheckpointEnabled } = recoveryPointConfiguration;
  const latestReplJobs = getValue(STATIC_KEYS.VM_LATEST_REPLICATION_JOBS, values) || [];

  const getLatestSyncTime = (vmObj) => {
    for (let i = 0; i < latestReplJobs.length; i += 1) {
      const replObj = latestReplJobs[i];
      if (replObj.vmMoref === vmObj.moref) {
        return <DateItemRenderer data={replObj} field="currentSnapshotTime" user={user} dispatch={dispatch} t={t} />;
      }
    }
  };

  const renderReplDisabledVMs = () => (
    <>

      <li style={{ fontSize: '12px' }} className="text-warning">{t('recovery.stop.repl.title')}</li>
      <SimpleBar style={{ maxHeight: '20vh', marginBottom: '15px' }}>
        <Row className="ms-3 mt-1">
          <Col sm={6} style={{ fontSize: '12px' }} className="mb-1" key="name">{t('site.name')}</Col>
          <Col sm={6} style={{ fontSize: '12px' }} className="mb-1" key="value-label">{t('last.sync.time')}</Col>
          {selectedVms.map((el) => (
            <>
              <Col sm={6} style={{ fontSize: '12px' }} key={`name-${el.moref}`}>{el.name}</Col>
              <Col sm={6} style={{ fontSize: '12px' }} key={`val-${el.moref}`}>{getLatestSyncTime(el)}</Col>
            </>
          ))}
        </Row>
      </SimpleBar>
      {isRecoveryCheckpointEnabled ? (
        <>
          <p className="mb-0" style={{ fontWeight: 'bold' }}>Warning: Impact on Replication and Recovery</p>
          <small style={{ fontSize: '12px' }} className="mb-2">
            This plan uses point-in-time checkpoints. Pausing replication for the listed virtual machines will also halt the creation of new checkpoints.
            Existing checkpoints will still be automatically removed based on their configured retention policy.
          </small>
        </>
      ) : null}
      <p className="text-warning mb-1 mt-2">
        <small style={{ fontWeight: 'bold', fontSize: '13px' }}>Important : </small>
        Recovery may be inconsistent because the data of these virtual machines might not be fully synchronized with the others in the plan.
      </p>
      <small style={{ fontSize: '12px' }}>Additionally, any ongoing operations or changes to these virtual machines might not be captured while replication remains paused. Proceeding without resuming replication could result in partial or out-of-sync recoveries.</small>
    </>
  );
  const renderComponents = (key) => {
    switch (key) {
      case KEY_CONSTANTS.REPL_DISABLED_RECOVERY_WARNING_MODAL_TEXT:
        return renderReplDisabledVMs();
      default:
        return <li className="text-warning" style={{ fontSize: '12px' }}>{key}</li>;
    }
  };
  return (
    <>
      <SimpleBar style={{ maxHeight: '60vh' }}>
        {data.map((el) => renderComponents(el))}
      </SimpleBar>
    </>
  );
};

function mapStateToProps(state) {
  const { user, drPlans } = state;
  return { user, drPlans };
}
export default connect(mapStateToProps)(withTranslation()(WinPrepUpdateWarningMsg));
