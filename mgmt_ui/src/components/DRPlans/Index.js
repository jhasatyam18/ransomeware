import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { changePageTitle } from '../../utils/AppUtils';
import StopVmReplications from './StopVmReplications';
import Loader from '../Shared/Loader';

const Playbooks = React.lazy(() => import('./Playbook/Playbooks'));
const SinglePlaybookDetailsPage = React.lazy(() => import('./Playbook/SinglePlaybookDetailsPage'));

const DRPlans = React.lazy(() => import('./DRPlans'));
const DRPlanDetails = React.lazy(() => import('./DRPlanDetails'));
const DRPlanCleanup = React.lazy(() => import('./DRPlanCleanup'));

const Index = (props) => {
  const renderRoutes = () => {
    const { sites, dispatch, user, drPlans, drPlaybooks } = props;
    const { privileges = [] } = user;
    changePageTitle(user);
    if (privileges.length === 0) {
      return null;
    }
    return (
      <Suspense fallback={(
        <Loader />
      )}
      >
        <Routes>
          <Route path="plan/details/:id" element={<DRPlanDetails {...props} />} />
          <Route path="plan/details/:id/:flow" element={<StopVmReplications {...props} />} />
          <Route path="plan/:id/cleanup" element={<DRPlanCleanup {...props} />} />
          <Route path="plan/playbook/:name" element={<SinglePlaybookDetailsPage drPlaybooks={drPlaybooks} dispatch={dispatch} user={user} />} />
          <Route path="plan/playbooks" element={<Playbooks drPlaybooks={drPlaybooks} dispatch={dispatch} user={user} />} />
          <Route path="plans" element={<DRPlans user={user} sites={sites} dispatch={dispatch} drPlans={drPlans} />} />
          <Route path="*" element={<DRPlans user={user} sites={sites} dispatch={dispatch} drPlans={drPlans} />} />
        </Routes>
      </Suspense>

    );
  };
  return renderRoutes();
};

function mapStateToProps(state) {
  const { drPlans, drPlaybooks, user, sites } = state;
  return { drPlans, drPlaybooks, user, sites };
}
export default connect(mapStateToProps)(withTranslation()(Index));
