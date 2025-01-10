import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Container, Form, Label, Row } from 'reactstrap';
import { useParams } from 'react-router-dom';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import { fetchDRPlanById } from '../../store/actions/DrPlanActions';
import { PROTECTION_PLAN_DETAILS_PATH, PROTECTION_PLANS_PATH } from '../../constants/RouterConstants';
import { CLEANUP_DR } from '../../constants/InputConstants';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';

function DRPlanCleanup({ drPlans, t, dispatch, user }) {
  const { values = {} } = user;
  const { protectionPlan } = drPlans;
  const refresh = useSelector((state) => state.user.context.refresh);
  const [cleanupOptionType, setCleanupOptionType] = useState(CLEANUP_DR.TEST_RECOVERIES);
  const { id } = useParams();

  const planPath = PROTECTION_PLAN_DETAILS_PATH.replace(':id', id);
  const planName = protectionPlan ? protectionPlan.name : '';

  useEffect(() => {
    const selectedOption = getValue('ui.cleanup.type.value', values);
    if (!selectedOption) {
      dispatch(valueChange('ui.cleanup.type.value', CLEANUP_DR.TEST_RECOVERIES));
      setCleanupOptionType(CLEANUP_DR.TEST_RECOVERIES);
    }

    if (!protectionPlan) {
      dispatch(fetchDRPlanById(id));
    }
    dispatch(addMessage('cleanup page refresh', MESSAGE_TYPES.INFO));
  }, [refresh]);

  const handleCleanupOptionChange = (option) => {
    setCleanupOptionType(option);
    dispatch(valueChange('ui.cleanup.type.value', option));
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
            ]}
          />
          <Row className="margin-left-5">
            <Col sm={12}>{renderCleanupOptions()}</Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
}

const mapStateToProps = (state) => ({
  user: state.user,
  drPlans: state.drPlans,
});

export default connect(mapStateToProps)(withTranslation()(DRPlanCleanup));
