import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { EMAIL_SETTINGS_PATH, LICENSE_SETTINGS_PATH, SUPPORT_BUNDLE_PATH } from '../../constants/RouterConstants';
import Pages404 from '../../pages/Page-404';

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
        <Route component={Pages404} />
      </Switch>

    );
  }
}

export default withRouter(Settings);
