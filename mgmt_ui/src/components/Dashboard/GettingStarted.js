import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCookie } from '../../utils/CookieUtils';
import { APPLICATION_GETTING_STARTED_COMPLETED } from '../../constants/UserConstant';
import { NODES_PATH, PROTECTION_PLANS_PATH, SITES_PATH } from '../../constants/RouterConstants';

function GettingStarted(props) {
  const { dashboard, t, settings } = props;
  const { titles = {} } = dashboard;
  const { nodes } = settings;
  const { sites = 0, protectionPlans = -1 } = titles;
  const isNodesConfigured = nodes.length >= 2;
  const isSiteConfigured = sites >= 2;
  const isGettingStartedCompleted = getCookie(APPLICATION_GETTING_STARTED_COMPLETED);
  // if getting started already completed or configuration is already done then hide the component
  if (isGettingStartedCompleted || protectionPlans >= 1 || protectionPlans === -1) {
    return null;
  }
  function renderItem(stepName, icon, completed, path, isActive) {
    if (completed) {
      return (
        <div className="getting_started__item completed">
          <div className="step__icon">
            <i style={{ color: 'white' }} className="fa fa-check" />
          </div>
          <div className="step__name">{t(stepName)}</div>
        </div>
      );
    }
    return (
      <div className="getting_started__item">
        <div className={`step__icon ${isActive ? 'step__active' : 'step__disabled'}`}>
          <Link to={path} title={t(`${stepName}.tooltip`)}>
            <i style={{ color: 'white' }} className={`${icon} `} />
          </Link>
        </div>
        <div className="step__name">{t(stepName)}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="card-body">
        <p className="font-weight-medium color-white">
          {t('getting.started')}
        </p>
        <div className="getting_started">
          {renderItem('configure.nodes', 'fas fa-network-wired', isNodesConfigured, NODES_PATH, !isNodesConfigured)}
          <i className={`fas fa-chevron-right padding-top-15 ${isNodesConfigured ? 'text-success' : 'text-secondary'}`} />
          {renderItem('create.sites', 'fa fa-cloud', isSiteConfigured, SITES_PATH, (!isSiteConfigured && isNodesConfigured))}
          <i className={`fas fa-chevron-right padding-top-15 ${isSiteConfigured ? 'text-success' : 'text-secondary'}`} />
          {renderItem('protect.workloads', 'fas fa-layer-group', (protectionPlans >= 1), PROTECTION_PLANS_PATH, (isSiteConfigured && !(protectionPlans >= 1)))}
        </div>
      </div>

    </div>
  );
}

function mapStateToProps(state) {
  const { dashboard, settings } = state;
  return { dashboard, settings };
}
export default connect(mapStateToProps)(withTranslation()(GettingStarted));
