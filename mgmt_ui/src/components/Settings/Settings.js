import React, { Component } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { DASHBOARD_PATH } from '../../constants/RouterConstants';
import Roles from './Administration/Roles';
import Users from './Administration/Users';
import Scripts from './Scripts/Scripts';
import IdentityProvider from './IdentityPropviders/IdentityProvider';
import NodeUpdateScheduler from './System/NodeUpdateScheduler';
import NodeUpdateScheduleCreate from './System/NodeUpdateScheduleCreate';
import { KEY_CONSTANTS } from '../../constants/UserConstant';

const Throttling = React.lazy(() => import('./throttling/Throttling'));
const EmailSettings = React.lazy(() => import('./email/EmailSettings'));
const Support = React.lazy(() => import('./support/Support'));
const License = React.lazy(() => import('./License/License'));
class Settings extends Component {
  render() {
    return (
      <Routes>
        <Route path={KEY_CONSTANTS.ROUTE_EMAIL} element={<EmailSettings />} />
        <Route path={KEY_CONSTANTS.ROUTE_SUPPORT} element={<Support />} />
        <Route path={KEY_CONSTANTS.ROUTE_LICENSE} element={<License />} />
        <Route path={KEY_CONSTANTS.ROUTE_THROTTLING} element={<Throttling />} />
        <Route path={KEY_CONSTANTS.ROUTE_USERS} element={<Users />} />
        <Route path={KEY_CONSTANTS.ROUTE_ROLES} element={<Roles />} />
        <Route path={KEY_CONSTANTS.ROUTE_SCRIPT} element={<Scripts />} />
        <Route path={KEY_CONSTANTS.ROUTE_IDP} element={<IdentityProvider />} />
        <Route path={KEY_CONSTANTS.ROUTE_NODE_UPGRADE_SCHEDULER} element={<NodeUpdateScheduler />} />
        <Route path={KEY_CONSTANTS.ROUTE_NODE_UPGRADE_SCHEDULER_CREATE} element={<NodeUpdateScheduleCreate />} />
        <Route path="*" element={<Navigate to={DASHBOARD_PATH} />} />
      </Routes>
    );
  }
}

export default Settings;
