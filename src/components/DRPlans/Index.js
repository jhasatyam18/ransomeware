import React, { Suspense } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { PLAYBOOK_DETAILS_PAGE, PLAYBOOK_LIST, PROTECTION_PLANS_PATH, PROTECTION_PLAN_CLEANUP_PATH, PROTECTION_PLAN_DETAILS_PATH, PROTECTION_PLAN_STOP_REPLICATION } from '../../constants/RouterConstants';
import { changePageTitle } from '../../utils/AppUtils';
import StopVmReplications from './StopVmReplications';
import Loader from '../Shared/Loader';

const Dashboard = React.lazy(() => import('../Dashboard/Dashboard'));
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
        <Switch>
          <Route path={PROTECTION_PLANS_PATH} render={() => <DRPlans user={user} sites={sites} dispatch={dispatch} drPlans={drPlans} />} />
          <Route path={PROTECTION_PLAN_STOP_REPLICATION} render={() => <StopVmReplications {...props} />} />
          <Route path={PROTECTION_PLAN_DETAILS_PATH} render={() => <DRPlanDetails {...props} />} />
          <Route path={PROTECTION_PLAN_CLEANUP_PATH} render={() => <DRPlanCleanup {...props} />} />
          <Route path={PLAYBOOK_DETAILS_PAGE} render={() => <SinglePlaybookDetailsPage drPlaybooks={drPlaybooks} dispatch={dispatch} user={user} />} />
          <Route path={PLAYBOOK_LIST} render={() => <Playbooks drPlaybooks={drPlaybooks} dispatch={dispatch} user={user} />} />
          <Route render={() => <Dashboard {...props} />} />
        </Switch>
      </Suspense>

    );
  };
  return renderRoutes();
};

export default withRouter(Index);
