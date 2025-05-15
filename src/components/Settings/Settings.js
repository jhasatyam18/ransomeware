import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { EMAIL_SETTINGS_PATH, IDENTITY_PROVIDER, LICENSE_SETTINGS_PATH, NODE_UPDATE_SCHEDULER, NODE_UPDATE_SCHEDULER_CREATE, ROLES_SETTINGS_PATH, SCRIPTS_PATH, SUPPORT_BUNDLE_PATH, THROTTLING_SETTINGS_PATH, USER_SETTINGS_PATH } from '../../constants/RouterConstants';
import Pages404 from '../../pages/Page-404';
import Roles from './Administration/Roles';
import Users from './Administration/Users';
import Scripts from './Scripts/Scripts';
import IdentityProvider from './IdentityPropviders/IdentityProvider';
import NodeUpdateScheduler from './System/NodeUpdateScheduler';
import NodeUpdateScheduleCreate from './System/NodeUpdateScheduleCreate';

const Throttling = React.lazy(() => import('./throttling/Throttling'));
const EmailSettings = React.lazy(() => import('./email/EmailSettings'));
const Support = React.lazy(() => import('./support/Support'));
const License = React.lazy(() => import('./License/License'));
class Settings extends Component {
  render() {
    return (
      <Switch>
        <Route path={EMAIL_SETTINGS_PATH} render={() => <EmailSettings />} />
        <Route path={SUPPORT_BUNDLE_PATH} render={() => <Support />} />
        <Route path={LICENSE_SETTINGS_PATH} render={() => <License />} />
        <Route path={THROTTLING_SETTINGS_PATH} render={() => <Throttling />} />
        <Route path={USER_SETTINGS_PATH} render={() => <Users />} />
        <Route path={ROLES_SETTINGS_PATH} render={() => <Roles />} />
        <Route path={SCRIPTS_PATH} render={() => <Scripts />} />
        <Route path={IDENTITY_PROVIDER} render={() => <IdentityProvider />} />
        <Route exact path={NODE_UPDATE_SCHEDULER} render={() => <NodeUpdateScheduler />} />
        <Route path={NODE_UPDATE_SCHEDULER_CREATE} render={() => <NodeUpdateScheduleCreate />} />
        <Route component={Pages404} />
      </Switch>

    );
  }
}

export default withRouter(Settings);
