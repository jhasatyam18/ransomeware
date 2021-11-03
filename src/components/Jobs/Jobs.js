import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { JOBS_RECOVERY_PATH, JOBS_REPLICATION_PATH } from '../../constants/RouterConstants';
import Pages404 from '../../pages/Page-404';

const Replication = React.lazy(() => import('./Replication'));
const Recovery = React.lazy(() => import('./Recovery'));

class Jobs extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route path={JOBS_REPLICATION_PATH} render={() => <Replication protectionplanID={null} {...this.props} />} />
          <Route path={JOBS_RECOVERY_PATH} render={() => <Recovery protectionplanID={null} {...this.props} />} />
          <Route component={Pages404} />
        </Switch>
      </>
    );
  }
}

export default withRouter(Jobs);
