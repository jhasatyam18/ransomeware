import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Card, CardBody } from 'reactstrap';
import { copyInstanceConfiguration, resetInstanceConfiguration, fetchLastTestRecovery } from '../../../store/actions/RecoveryConfigActions';
import DMAccordion from '../../Shared/DMAccordion';
import DMNote from '../../Common/DMNote';
import { getValue } from '../../../utils/InputUtils';
import { createVMTestRecoveryConfig } from '../../../utils/RecoveryUtils';
import { NOTE_TEXT } from '../../../constants/DMNoteConstant';
import { COPY_CONFIG, STATIC_KEYS, UI_WORKFLOW } from '../../../constants/InputConstants';
import { valueChange } from '../../../store/actions';

function TestRecoveryVMConfiguration(props) {
  const { user, dispatch, t } = props;
  const { values } = user;
  const option = getValue('ui.recovery.option', values);

  useEffect(() => {
    dispatch(fetchLastTestRecovery());
    onRecoveryConfigOptChange(option);
  }, []);

  const previousRecoveryConfig = getValue('ui.previous.recovery.config.test', values) || [];
  const recoveryConfig = getValue('ui.current.recovery.config.test', values) || [];
  const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values) || [];
  let renderPrevTestRecCheckbox;
  const previousRecoveryConfigKeys = Object.keys(previousRecoveryConfig);
  const recoveryConfigKeys = Object.keys(recoveryConfig);

  const configToCopy = [{ value: COPY_CONFIG.GENERAL_CONFIG, label: t('label.general') },
    { value: COPY_CONFIG.NETWORK_CONFIG, label: t('label.network') },
    { value: COPY_CONFIG.REP_SCRIPT_CONFIG, label: t('label.replication.scripts') },
    { value: COPY_CONFIG.REC_SCRIPT_CONFIG, label: t('label.recovery.scripts') }];

  // this check if there is atleast one previous recovery config
  for (let i = 0; i < previousRecoveryConfigKeys.length; i += 1) {
    if (typeof selectedVMs[previousRecoveryConfigKeys[i]] !== 'undefined') {
      renderPrevTestRecCheckbox = true;
      break;
    }
  }

  const workFlow = getValue('ui.workflow', values);
  const renderVMConfig = (vm, index) => {
    const config = createVMTestRecoveryConfig(vm, user, dispatch);
    const key = (typeof vm === 'string' ? vm : vm.moref);
    return (
      <DMAccordion title={vm.name} sourceID={key} config={config} dispatch={dispatch} user={user} key={`accordion-vm-config-${vm.name}`} openByDefault={index === 0 ? 'true' : false} />
    );
  };

  const renderNodes = () => Object.keys(selectedVMs).map((key, index) => (
    renderVMConfig(selectedVMs[key], index)
  ));

  function onRecoveryConfigOptChange(value) {
    dispatch(valueChange('ui.recovery.option', value));
    if (selectedVMs) {
      if (value === 'current' && recoveryConfigKeys.length > 0) {
        Object.keys(selectedVMs).map((key) => {
          if (recoveryConfig[key]) {
            dispatch(copyInstanceConfiguration({ targetVMs: [selectedVMs[key].moref], configToCopy, sourceData: recoveryConfig[key] }));
          }
        });
      } else if (previousRecoveryConfigKeys.length > 0) {
        const selectedvmkey = Object.keys(selectedVMs);
        selectedvmkey.forEach((vmkey) => {
          if (previousRecoveryConfig[vmkey]) {
            dispatch(copyInstanceConfiguration({ targetVMs: [previousRecoveryConfig[vmkey].sourceMoref], configToCopy, sourceData: previousRecoveryConfig[vmkey] }));
          } else {
            dispatch(resetInstanceConfiguration({ targetVMs: [vmkey], configToReset: configToCopy }));
          }
        });
      }
    }
  }

  const renderNote = () => <DMNote title="Info" info="test.recovery.note" subText="test.recovery.staticIP.warning" color={NOTE_TEXT.INFO} open />;

  const prevRecoveryConfigOpt = () => (
    <>
      <div className="custom-control custom-checkbox padding-bottom-8 test_rec_config">
        <div>
          <input type="radio" id="cure" name="option" value="current" checked={option === 'current'} onChange={(e) => onRecoveryConfigOptChange(e.target.value)} />
          <label htmlFor="current" style={{ paddingLeft: '5px', cursor: 'pointer' }} aria-hidden="true" onClick={() => onRecoveryConfigOptChange('current')}>Recovery Configuration</label>
        </div>
        <div>
          <input type="radio" id="previous" name="option" value="previous" checked={option === 'previous'} onChange={(e) => onRecoveryConfigOptChange(e.target.value)} />
          <label htmlFor="previous" style={{ paddingLeft: '5px', cursor: 'pointer' }} aria-hidden="true" onClick={() => onRecoveryConfigOptChange('previous')}>Previous Test Recovery Configuration</label>
        </div>
      </div>
    </>
  );

  const renderTestRecoveryItems = () => (
    <>
      {renderNote()}
      {renderPrevTestRecCheckbox ? prevRecoveryConfigOpt() : null}
    </>
  );

  return (
    <Card>
      <CardBody>
        {workFlow === UI_WORKFLOW.TEST_RECOVERY ? renderTestRecoveryItems() : null}
        {renderNodes()}
      </CardBody>
    </Card>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps)(withTranslation()(TestRecoveryVMConfiguration));
