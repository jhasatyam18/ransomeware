import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Container, Form, Label, Row } from 'reactstrap';
import { useParams } from 'react-router-dom';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DMCollapsibleTable from '../Common/DMCollapsibleTable';
import ActionButton from '../Common/ActionButton';
import { fetchDRPlanById } from '../../store/actions/DrPlanActions';
import { PROTECTION_PLAN_DETAILS_PATH, PROTECTION_PLANS_PATH } from '../../constants/RouterConstants';
import { CLEANUP_DR } from '../../constants/InputConstants';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions';
import { TABLE_CLEANUP_DR_COPIES } from '../../constants/TableConstants';
import { cleanupResources, cleanupToggleChildRow, fetchCleanupResources, handleCleanupTableSelection, handleSelectAllCleanupResources, onFilterTable, setCleanupData } from '../../store/actions/cleanupActions';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import { getCleanupResourcesPayload } from '../../utils/PayloadUtil';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { openModal } from '../../store/actions/ModalActions';
import DMTPaginator from '../Table/DMTPaginator';
import { formatLocalString } from '../../utils/LocallUtils';

function DRPlanCleanup({ drPlans, t, dispatch, user }) {
  const { values = {} } = user;
  const { protectionPlan, cleanup = {} } = drPlans;
  const { data = [], selectedResources = {}, fullData = [] } = cleanup;
  const refresh = useSelector((state) => state.user.context.refresh);
  const [cleanupOptionType, setCleanupOptionType] = useState(CLEANUP_DR.TEST_RECOVERIES);
  const [hasSearchFilter, setSearchFilter] = useState(false);
  const { id } = useParams();
  const disableBtn = Object.keys(selectedResources).length === 0 || !hasRequestedPrivileges(user, ['recovery.test']);
  const planPath = PROTECTION_PLAN_DETAILS_PATH.replace(':id', id);
  const planName = protectionPlan ? protectionPlan.name : '';

  useEffect(() => {
    let selectedOption = getValue('ui.cleanup.type.value', values);
    if (!selectedOption) {
      dispatch(valueChange('ui.cleanup.type.value', CLEANUP_DR.TEST_RECOVERIES));
      setCleanupOptionType(CLEANUP_DR.TEST_RECOVERIES);
      selectedOption = CLEANUP_DR.TEST_RECOVERIES;
    } else {
      setCleanupOptionType(selectedOption);
    }
    dispatch(fetchCleanupResources(selectedOption, id));
    if (!protectionPlan) {
      dispatch(fetchDRPlanById(id));
    }
    return () => {
      dispatch(valueChange('ui.cleanup.type.value', selectedOption));
    };
  }, [refresh]);

  const onFilter = (c) => {
    dispatch(onFilterTable(c));
    if (c.trim() === '') {
      setSearchFilter(true);
    } else {
      setSearchFilter(false);
    }
  };

  const setDataForDisplay = (d) => {
    dispatch(setCleanupData(d));
  };

  const onCleanAction = () => {
    const payload = getCleanupResourcesPayload(cleanup);
    const title = formatLocalString(t('clean.delete.warning'), payload.deletedCount);
    const options = { title: 'Alert', confirmAction: cleanupResources, message: title, id };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const handleCleanupOptionChange = (option) => {
    setCleanupOptionType(option);
    dispatch(valueChange('ui.cleanup.type.value', option));
    dispatch(fetchCleanupResources(option, id));
  };

  const renderCleanupOptions = () => (
    <Form>
      <div className="form-check-inline">
        <Label className="form-check-label" htmlFor="cleanup-test-recoveries-option">
          <input
            type="radio"
            className="form-check-input"
            id="cleanup-test-recoveries-option"
            name="cleanupType"
            checked={cleanupOptionType === CLEANUP_DR.TEST_RECOVERIES}
            onChange={() => handleCleanupOptionChange(CLEANUP_DR.TEST_RECOVERIES)}
          />
          {t('cleanup.test.recoveries')}
        </Label>
      </div>
      <div className="form-check-inline">
        <Label className="form-check-label" htmlFor="cleanup-recoveries-option">
          <input
            type="radio"
            className="form-check-input"
            id="cleanup-recoveries-option"
            name="cleanupType"
            checked={cleanupOptionType === CLEANUP_DR.DR_COPIES}
            onChange={() => handleCleanupOptionChange(CLEANUP_DR.DR_COPIES)}
          />
          {t('cleanup.recoveries')}
        </Label>
      </div>
    </Form>
  );

  return (
    <Container fluid>
      <Card>
        <CardBody>
          <DMBreadCrumb
            links={[
              { label: t('protection.plans'), link: PROTECTION_PLANS_PATH },
              { label: planName, link: planPath },
              { label: 'Cleanup', link: '#' },
            ]}
          />
          <Row className="padding-left-20">
            <Col sm={12}>{renderCleanupOptions()}</Col>
          </Row>
          <Row className="pr-4 padding-left-20">
            <Col sm={6} className="padding-top-10 padding-bottom-10">
              <ActionButton label="Cleanup" t={t} key="cleanupBtn" isDisabled={disableBtn} onClick={onCleanAction} />
            </Col>
            <Col sm={6}>
              <DMTPaginator
                id="cleanupRecovery"
                data={hasSearchFilter ? data : fullData}
                setData={setDataForDisplay}
                showFilter="true"
                onFilter={onFilter}
                columns={TABLE_CLEANUP_DR_COPIES}
              />
            </Col>
            <Col sm={12} className="padding-top-5 margin-top-5">
              <DMCollapsibleTable
                data={data}
                columns={TABLE_CLEANUP_DR_COPIES}
                isSelectable
                tableID="cleanup-resources"
                name="cleanup-resources"
                primaryKey="workloadID"
                childPrimaryKey="resourceID"
                onSelect={handleCleanupTableSelection}
                selectedData={selectedResources}
                toggleRow={cleanupToggleChildRow}
                onSelectAll={handleSelectAllCleanupResources}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
}

function mapStateToProps(state) {
  const { drPlans, user } = state;
  return { drPlans, user };
}

export default connect(mapStateToProps)(withTranslation()(DRPlanCleanup));
