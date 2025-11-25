import React, { Component, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DASHBOARD_PATH } from '../../constants/RouterConstants';
import { KEY_CONSTANTS } from '../../constants/UserConstant';
import Loader from '../Shared/Loader';

const Replication = React.lazy(() => import('./Replication'));
const Recovery = React.lazy(() => import('./Recovery'));
class Jobs extends Component {
  render() {
    return (
      <>
        <Suspense fallback={(<Loader />)}>
          <Routes>
            <Route path={KEY_CONSTANTS.ROUTE_REPLICATION} element={<Replication protectionplanID={null} {...this.props} />} />
            <Route path={KEY_CONSTANTS.ROUTE_RECOVERY} element={<Recovery protectionplanID={null} {...this.props} />} />
            <Route render={<Navigate to={DASHBOARD_PATH} />} />
          </Routes>
        </Suspense>
      </>
    );
  }
}

export default Jobs;
