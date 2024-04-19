import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { valueChange } from '../../store/actions';
import { getStorageWithUnit } from '../../utils/AppUtils';
import OsTypeItemRenderer from '../Table/ItemRenderers/OsTypeItemRenderer';
import StatusItemRenderer from '../Table/ItemRenderers/StatusItemRenderer';
import { getDiskLabel, getValue } from '../../utils/InputUtils';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import { isVMRecovered } from '../../utils/validationUtils';

function RenderResetReplicationVms(props) {
  const { t, vmData, dispatch, user, selectedPlan } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { name, virtualDisks, moref } = vmData;
  const { values } = user;
  const { protectedSite } = selectedPlan;
  const isVMwareSource = protectedSite.platformType === PLATFORM_TYPES.VMware;
  const getVMidObj = getValue(`reset-repl-vm-id-${moref}`, values);
  const toggle = () => {
    const isRecovered = isVMRecovered(vmData);
    if (isRecovered) {
      return;
    }
    setIsOpen(!isOpen);
  };

  const renderIcon = () => (
    <div className="wizard-header-options">
      <div className="wizard-header-div">
        {isOpen ? <box-icon name="chevron-down" color="white" onClick={toggle} style={{ height: 20 }} />
          : <box-icon name="chevron-right" color="white" onClick={toggle} style={{ height: 20 }} /> }
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
        <Col sm={4}>
          &nbsp;
        </Col>
        <Col sm={7}>
          <Row>
            <Col sm={4}>
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className={`custom-control-input ${isReplicationReset === true ? 'checkbox_disabled' : ''}`} id={key} checked={value} name={key} onChange={(e) => handleChange(e, key)} disabled={isReplicationReset} />
                <label className="custom-control-label  margin-right-8" htmlFor={key}>
                  <box-icon name="hdd" size="sm" color="white" style={{ width: '17px', position: 'relative', top: '-3px' }} />
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

  const renderDisks = () => virtualDisks.map((disk, ind) => renderCheckboxAndLabel(disk, ind));
  const renderRecoveryStatus = () => {
    if (vmData.recoveryStatus === '' || typeof vmData.lastRunTime === 'undefined' || vmData.lastRunTime === 0) {
      return null;
    }
    return (
      <StatusItemRenderer data={vmData} field="recoveryStatus" showDate="true" />
    );
  };

  return (
    <div key="dm-accordion-sksk">
      <Card className="margin-bottom-10">
        <CardHeader style={{ backgroundColor: '#2a3042', border: '1px solid #464952' }}>
          <Row>
            {renderIcon()}
            <Col sm={9}>
              <Row>
                <Col sm={5}>
                  <div className="stack_horizontally">
                    <OsTypeItemRenderer className="link_color" data={vmData} />
                    &nbsp;&nbsp;
                    <span aria-hidden className="link_color margin-right-30" onClick={toggle}>
                      {name}
                    </span>
                  </div>
                </Col>
                <Col sm={3}>
                  <span aria-hidden className="margin-right-30">
                    {` ${t('total.disks')} -  ${vmData.virtualDisks.length}`}
                  </span>
                </Col>
                <Col sm={3}>
                  {renderRecoveryStatus()}
                </Col>
              </Row>
            </Col>
          </Row>
          <Collapse isOpen={isOpen}>
            <Row className="padding-left-30">
              {isVMRecovered(vmData) ? null : renderDisks()}
            </Row>
          </Collapse>
        </CardHeader>
      </Card>
    </div>
  );
}

export default (withTranslation()(RenderResetReplicationVms));
