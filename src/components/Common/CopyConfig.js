import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { Col, Collapse, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import SimpleBar from 'simplebar-react';
import { valueChange } from '../../store/actions';
import DMToolTip from '../Shared/DMToolTip';
import { copyInstanceConfiguration, resetInstanceConfiguration } from '../../store/actions/RecoveryConfigActions';
import { openModal } from '../../store/actions/ModalActions';
import { addMessage } from '../../store/actions/MessageActions';
import { getValue } from '../../utils/InputUtils';
import { getRecoveryInfoForVM } from '../../utils/RecoveryUtils';
import { getSearchSelectStyle } from '../../utils/ApiUtils';
import { COPY_CONFIG, STATIC_KEYS } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { MODAL_SHOW_RESETED_VMS, MODAL_SUMMARY } from '../../constants/Modalconstant';

function CopyVMConfig(props) {
  const { dispatch, user, ID, t } = props;
  const { values } = user;
  const [config, setConfig] = useState([]);
  const [targetVMs, setTargetVMs] = useState([]);
  const selectedTargets = getValue('copy.config.selected.vms', values) || [];
  const selectedConfig = getValue('copy.config.configuration', values) || [];
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
      const targetData = [];
      const configs = [];
      targetData.push({ value: 'ALL', label: 'All' });
      Object.keys(selectedVMs).map((key) => {
        if (key !== ID) {
          targetData.push({ value: key, label: selectedVMs[key].name });
        }
      });
      setTargetVMs(targetData);
      configs.push({ value: COPY_CONFIG.ALL, label: 'All' });
      configs.push({ value: COPY_CONFIG.GENERAL_CONFIG, label: t('label.general') });
      configs.push({ value: COPY_CONFIG.NETWORK_CONFIG, label: t('label.network') });
      configs.push({ value: COPY_CONFIG.REP_SCRIPT_CONFIG, label: t('label.replication.scripts') });
      configs.push({ value: COPY_CONFIG.REC_SCRIPT_CONFIG, label: t('label.recovery.scripts') });
      setConfig(configs);
    }
    return () => {
      isUnmounting = true;
    };
  }, []);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  /**
   * Handle target object changes
   */
  const handleTargetChange = (selected) => {
    if (selected.length > 0) {
      if (selected[selected.length - 1].value === 'ALL') {
        dispatch(valueChange('copy.config.selected.vms', [{ label: 'All', value: 'ALL' }]));
      } else {
        const result = selected.filter((s) => {
          if (s.value !== 'ALL') {
            return s;
          }
        });
        dispatch(valueChange('copy.config.selected.vms', result));
      }
    } else {
      dispatch(valueChange('copy.config.selected.vms', []));
    }
  };
  /**
   * Handle config object changes
   */
  const handleConfigChange = (selected) => {
    if (selected.length > 0) {
      if (selected[selected.length - 1].value === 'ALL') {
        dispatch(valueChange('copy.config.configuration', [{ label: 'All', value: 'ALL' }]));
      } else {
        const result = selected.filter((s) => {
          if (s.value !== 'ALL') {
            return s;
          }
        });
        dispatch(valueChange('copy.config.configuration', result));
      }
    } else {
      dispatch(valueChange('copy.config.configuration', []));
    }
  };

  const getTargetVmAndCopyConfigs = () => {
    const targets = [];
    let configToCopy = [];
    if (!selectedTargets || selectedTargets.length === 0 || !selectedConfig || selectedConfig.length === 0) {
      dispatch(addMessage('Select Target virtual machines and configuration to copy.', MESSAGE_TYPES.ERROR));
      return;
    }
    const useAllSelectedTargets = selectedTargets.some((c) => c.value === 'ALL');
    const useAllConfigs = selectedConfig.some((c) => c.value === 'ALL');
    const targetNames = [];
    if (useAllSelectedTargets) {
      targetVMs.forEach((tgt) => {
        if (tgt.value !== ID && tgt.value !== 'ALL') {
          targets.push(tgt.value);
          targetNames.push(tgt.label);
        }
      });
    } else {
      Object.keys(selectedTargets).map((vm) => {
        targets.push(selectedTargets[vm].value);
        targetNames.push(selectedTargets[vm].label);
      });
    }
    if (useAllConfigs) {
      config.forEach((c) => {
        if (c.value !== 'ALL') {
          configToCopy.push(c);
        }
      });
    } else {
      configToCopy = [...selectedConfig];
    }
    return { targets, configToCopy, targetNames };
  };

  /**
   * Compute and dispatch the target and config changes for copy.
   */
  const copyConfig = () => {
    const { targets, configToCopy, targetNames } = getTargetVmAndCopyConfigs();
    const data = getRecoveryInfoForVM({ sourceMoref: ID, user, configToCopy, values });
    const options = { title: 'Copy Configuration', note: ' On confirmation configuration will get copied to the following instances.', data, reduxAction: copyInstanceConfiguration, reduxArgs: { sourceVM: ID, targetVMs: targets, configToCopy, dispatch }, targetNames, css: 'modal-lg' };
    dispatch(openModal(MODAL_SUMMARY, options));
  };

  const onReset = () => {
    const { targets, configToCopy, targetNames } = getTargetVmAndCopyConfigs();
    const options = { title: 'Reset Configuration', note: 'Are you sure you want to reset following vms recovery configuration ?', reduxAction: resetInstanceConfiguration, reduxArgs: { targetVMs: targets, configToReset: configToCopy }, targetNames, css: 'modal-lg' };
    dispatch(openModal(MODAL_SHOW_RESETED_VMS, options));
  };

  function MenuList(pr) {
    const { children } = pr;
    return (
      <components.MenuList {...pr}>
        <SimpleBar style={{ maxHeight: '200px' }}>{children}</SimpleBar>
      </components.MenuList>
    );
  }
  const renderSource = () => {
    const isMultiSelect = true;
    return (
      <>
        <Select
          options={targetVMs}
          isMulti={isMultiSelect}
          closeMenuOnSelect={false}
          onChange={handleTargetChange}
          allowSelectAll={isMultiSelect}
          value={selectedTargets}
          styles={getSearchSelectStyle(false)}
          components={{ MenuList }}
          captureMenuScroll={false}
        />
      </>
    );
  };

  const renderConfig = () => {
    const isMultiSelect = true;
    return (
      <>
        <Select
          options={config}
          isMulti={isMultiSelect}
          styles={getSearchSelectStyle(false)}
          value={selectedConfig}
          onChange={handleConfigChange}
        />
      </>
    );
  };

  return (
    <div>
      <Row>
        <Col>
          <a href="#" onClick={toggle} className="text-success">
            {t('title.copy.config')}
          </a>
        </Col>
        <Col>
          <DMToolTip tooltip="info.copy.config" />
        </Col>
      </Row>
      <Collapse isOpen={isOpen}>
        <Row className="padding-top-10">
          <Col sm={6} className="margin-left-5">
            Select VM Configuration
          </Col>
          <Col sm={5} className="margin-left-2">Select Configuration</Col>
          <Col sm={6} className="padding-top-10">{renderSource()}</Col>
          <Col sm={6} className="padding-top-10">{renderConfig()}</Col>
          <Col sm={12} className="padding-top-15 margin-left-5">
            <button type="button" className="btn btn-success" onClick={copyConfig}>
              {t('apply')}
            </button>
            <button type="button" className="margin-left-10 btn btn-danger" onClick={onReset}>
              {t('Reset')}
            </button>
          </Col>
        </Row>
      </Collapse>
    </div>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(CopyVMConfig));
