import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle } from 'reactstrap';
import { useSelector } from 'react-redux';
import { KEY_CONSTANTS } from '../../constants/UserConstant';
import { fetchDRPlanById } from '../../store/actions/DrPlanActions';
import { PROTECTION_PLANS_PATH, PROTECTION_PLAN_DETAILS_PATH } from '../../constants/RouterConstants';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import SelectiveReplicationVm from './SelectiveReplicationVm';

const StopVmReplications = (props) => {
  const { drPlans, t, dispatch } = props;
  const { protectionPlan } = drPlans;
  const path = window.location.pathname.split('/');
  const workflow = path[path.length - 1];
  const refresh = useSelector((state) => state.user.context.refresh);
  useEffect(() => {
    dispatch(fetchDRPlanById(path[path.length - 2], workflow));
  }, [refresh]);

  if (!protectionPlan || Object.keys(protectionPlan).length === 0) {
    return null;
  }
  const { name, id } = protectionPlan;
  const planPath = PROTECTION_PLAN_DETAILS_PATH.replace(':id', id);
  return (
    <Card>
      <CardBody>
        <DMBreadCrumb className="padding-left-8" links={[{ label: 'protection.plans', link: PROTECTION_PLANS_PATH }, { label: name, link: planPath }, { label: workflow === KEY_CONSTANTS.STOP ? 'Stop' : 'Start', link: '#' }]} />
        <CardTitle className="padding-left-15">
          {workflow === KEY_CONSTANTS.STOP ? t('stop.replication.select.workload.title') : t('start.replication.select.workload.title')}
        </CardTitle>
        <SelectiveReplicationVm protectionPlan={protectionPlan} dispatch={dispatch} t={t} />
      </CardBody>
    </Card>
  );
};

export default (withTranslation()(StopVmReplications));
