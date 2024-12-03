import { faChevronDown, faChevronRight, faHdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import { valueChange } from '../../store/actions';
import { getStorageWithUnit } from '../../utils/AppUtils';
import { getDiskLabel, getValue } from '../../utils/InputUtils';
import OsTypeItemRenderer from '../Table/ItemRenderers/OsTypeItemRenderer';
import StatusItemRenderer from '../Table/ItemRenderers/StatusItemRenderer';
import { calculatePerVMDiskData, isVMRecoveredOrNotAvailable } from '../../utils/ResyncDiskUtils';

function RenderResetReplicationVms(props) {
  const { t, vmData, dispatch, user, selectedPlan } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { name, virtualDisks, moref } = vmData;
  const { values } = user;
  const { protectedSite } = selectedPlan;
  const isVMwareSource = protectedSite.platformType === PLATFORM_TYPES.VMware;
  const getVMidObj = getValue(`reset-repl-vm-id-${moref}`, values);
  const { selectedDiskCount, selectedDiskSize } = calculatePerVMDiskData(vmData, virtualDisks, user);
  const toggle = () => {
    const isRecovered = isVMRecoveredOrNotAvailable(vmData);
    if (isRecovered) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const renderIcon = () => (
    <div className="wizard-header-options">
      <div className="wizard-header-div">
        {isOpen ? <FontAwesomeIcon size="sm" icon={faChevronDown} onClick={toggle} />
          : <FontAwesomeIcon size="sm" icon={faChevronRight} onClick={toggle} />}
      </div>
    </div>
  );

  const handleChange = (e, key) => {
    const newObj = { ...getVMidObj, [key]: e.target.checked };
    dispatch(valueChange(`reset-repl-vm-id-${moref}`, newObj));
  };

  const getCheckboxValue = (key) => {
    const fieldValue = getVMidObj[key];
    if (typeof fieldValue !== 'boolean') {
      return false;
    }
    return fieldValue;
  };

  const renderCheckboxAndLabel = (diskData, index) => {
    const { isReplicationReset, isDeleted } = diskData;
    const key = `${diskData.id}`;
    const value = getCheckboxValue(key);
    if (isDeleted) {
      return null;
    }
    return (
      <>
        <Col sm={3}>
          &nbsp;
        </Col>
        <Col sm={7}>
          <Row>
            <Col sm={5}>
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className={`custom-control-input ${isReplicationReset === true ? 'checkbox_disabled' : ''}`} id={`${name}-${index === 0 ? `os-disk-${index}` : `data-disk-${index}`}`} checked={value} name={key} onChange={(e) => handleChange(e, key)} disabled={isReplicationReset} />
                <label className="custom-control-label  margin-right-8" htmlFor={`${name}-${index === 0 ? `os-disk-${index}` : `data-disk-${index}`}`}>
                  <FontAwesomeIcon size="sm" icon={faHdd} />
                </label>
                <span className="margin-right-20">
                  {getDiskLabel(diskData, index, isVMwareSource)}
                </span>
              </div>
            </Col>
            <Col sm={2}>
              {getStorageWithUnit(diskData.size)}
            </Col>
            <Col sm={4}>
              {diskData.diskType}
            </Col>
          </Row>
        </Col>
      </>
    );
  };

  const calculateDisk = () => {
    let diskCount = 0;
    virtualDisks.forEach((disk) => {
      if (!disk.isDeleted) {
        diskCount += 1;
      }
    });
    return diskCount;
  };

  const renderDisks = () => virtualDisks.map((disk, ind) => renderCheckboxAndLabel(disk, ind));
  const renderRecoveryStatus = () => {
    if (vmData.recoveryStatus === '' || typeof vmData.lastRunTime === 'undefined' || vmData.lastRunTime === 0) {
      return null;
    }
    return (
      <StatusItemRenderer data={vmData} field="recoveryStatus" showDate="true" />
    );
  };

  const showResync = () => {
    const vmMoref = getValue(`reset-repl-vm-id-${vmData.moref}`, values);
    let flag = false;
    if (isVMRecoveredOrNotAvailable(vmData)) {
      return flag;
    }
    virtualDisks.forEach((d) => {
      if (vmMoref[d.id] === true) {
        flag = true;
      }
    });
    return flag;
  };

  return (
    <div key="dm-accordion-sksk">
      <Card className="margin-bottom-10">
        <CardHeader style={{ backgroundColor: '#2a3042', border: '1px solid #464952' }}>
          <Row>
            <Col sm={12}>
              <Row>
                <Col sm={2}>
                  <div className="stack_horizontally">
                    {renderIcon()}
                    <OsTypeItemRenderer className="link_color" data={vmData} />
                    &nbsp;&nbsp;
                    <span aria-hidden className="link_color" onClick={toggle}>
                      {name}
                    </span>
                  </div>
                </Col>
                <Col sm={3}>
                  <span aria-hidden>
                    {` ${t('total.disks')} -  ${calculateDisk()}`}
                  </span>
                </Col>
                <Col sm={5}>
                  {renderRecoveryStatus()}
                </Col>
                <Col sm={2}>
                  {showResync() ? <span className="text-success">{t('per.vm.resync.disk', { selectedDiskCount, selectedDiskSize })}</span> : null }
                </Col>
              </Row>
            </Col>
          </Row>
          <Collapse isOpen={isOpen}>
            <Row className="padding-left-30">
              {isVMRecoveredOrNotAvailable(vmData) ? null : renderDisks()}
            </Row>
          </Collapse>
        </CardHeader>
      </Card>
    </div>
  );
}

export default (withTranslation()(RenderResetReplicationVms));
