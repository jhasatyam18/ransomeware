import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Form, Label, Row } from 'reactstrap';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import { TABLE_FILTER_TEXT, TABLE_PROTECTION_PLAN_VMS, TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';
import DMTPaginator from '../Table/DMTPaginator';
import { filterData } from '../../utils/AppUtils';

function ProtectionPlanVMConfig(props) {
  const [viewProtection, setViewProtection] = useState(true);
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [hasFilterString, setHasFilterString] = useState(false);
  const [configDataToDisplay, setConfigDataToDisplay] = useState([]);
  const [configSearchData, setConfigSearchData] = useState([]);
  const [configHasFilterString, setConfigHasFilterString] = useState(false);
  const { protectionPlan, dispatch, t } = props;
  const { protectedEntities, recoveryEntities, recoverySite } = protectionPlan;
  const { virtualMachines } = protectedEntities;
  const { instanceDetails } = recoveryEntities;
  let cols = TABLE_PROTECTION_PLAN_VMS;
  let configCols = TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG;

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

  const onFilter = (criteria) => {
    if (viewProtection) {
      const data = (virtualMachines.length > 0 ? virtualMachines : []);
      if (criteria.trim() === '') {
        setHasFilterString(false);
        setSearchData([]);
      } else {
        const newData = filterData(data, criteria.trim(), cols);
        setHasFilterString(true);
        setSearchData(newData);
      }
    } else {
      const data = (instanceDetails.length > 0 ? instanceDetails : []);
      if (criteria.trim() === '') {
        setConfigHasFilterString(false);
        setConfigSearchData([]);
      } else {
        const newData = filterData(data, criteria.trim(), configCols);
        setConfigHasFilterString(true);
        setConfigSearchData(newData);
      }
    }
  };

  const setDataForDisplay = (data) => {
    if (viewProtection) {
      setDataToDisplay(data);
    } else {
      setConfigDataToDisplay(data);
    }
  };

  const renderProtectedEntities = () => {
    if (recoverySite.node.isLocalNode) {
      cols = TABLE_PROTECTION_PLAN_VMS.slice(0, TABLE_PROTECTION_PLAN_VMS.length - 1);
    }
    return (
      <Col sm="12">
        <DMTable
          dispatch={dispatch}
          columns={cols}
          data={dataToDisplay}
        />
      </Col>
    );
  };

  const renderRecoveryEntities = () => {
    const { platformType } = recoverySite.platformDetails;
    if (platformType === PLATFORM_TYPES.VMware) {
      const part1 = TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG.slice(0, TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG.length - 4);
      const part2 = TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG.slice(TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG.length - 3);
      configCols = [...part1, ...part2];
    } else if (platformType === PLATFORM_TYPES.Azure) {
      configCols = TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG;
    } else {
      const part1 = TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG.slice(0, TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG.length - 3);
      const part2 = TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG.slice(TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG.length - 2);
      configCols = [...part1, ...part2];
    }
    return (
      <>
        <Col sm="12">
          <DMTable
            dispatch={dispatch}
            columns={configCols}
            data={configDataToDisplay}
          />
        </Col>
      </>
    );
  };

  const render = () => {
    const vmData = (hasFilterString ? searchData : virtualMachines) || [];
    const vmConfigData = (configHasFilterString ? configSearchData : instanceDetails) || [];
    return (
      <div>
        <Row className="pr-4">
          <Col sm={5} className="mt-2">{renderOptions()}</Col>
          <Col sm={7}>
            <DMTPaginator
              id={viewProtection ? 'protectedmachine' : 'recoveryconfig'}
              data={viewProtection ? vmData : vmConfigData}
              setData={setDataForDisplay}
              showFilter="true"
              onFilter={onFilter}
              columns={viewProtection ? cols : configCols}
              filterHelpText={viewProtection ? TABLE_FILTER_TEXT.TABLE_PROTECTION_PLAN_VMS : TABLE_FILTER_TEXT.TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG}
            />
          </Col>
        </Row>
        <Row>
          {viewProtection ? renderProtectedEntities() : renderRecoveryEntities()}
        </Row>
      </div>
    );
  };

  return render();
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ProtectionPlanVMConfig));
