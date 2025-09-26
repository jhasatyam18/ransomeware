import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Pages404 from '../../pages/Page-404';
import ReportScheduleCreate from './ReportSceduleCreate';
import { REPORT_SCHEDULE_CREATE, REPORTS_PATH } from '../../constants/RouterConstants';

const Report = React.lazy(() => import('./Report'));

class ReportIndex extends Component {
  render() {
    return (
      <Switch>
        <Route path={REPORT_SCHEDULE_CREATE} render={() => <ReportScheduleCreate />} />
        <Route path={REPORTS_PATH} render={() => <Report />} />
        <Route component={Pages404} />
      </Switch>
    );
  }
}

export default withRouter(ReportIndex);
