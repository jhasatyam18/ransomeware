import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getValue } from '../../utils/InputUtils';
import { getCriteria } from '../../store/actions/ReportActions';
import { getReportScheduleText } from '../../utils/ReportUtils';

const ReportSummaryStep = (props) => {
  const { user, t } = props;
  const copies = getValue('ui.report.scheduler.maintain', user.values) || '';
  const configuredEmails = getValue('schedule.report.email', user.values) || '';
  // Report config list
  const reportFor = ['Sites', 'Protection Plans'];
  const criteria = getCriteria(user);

  if (criteria?.includeSystemOverView) reportFor.push('Dashboard Summary');
  if (criteria?.includeNodes) reportFor.push('Nodes');
  if (criteria?.includeEvents) reportFor.push('Events');
  if (criteria?.includeAlerts) reportFor.push('Alerts');
  if (criteria?.includeProtectedVMS) reportFor.push('Protected Virtual Machines');
  if (criteria?.includeReplicationJobs) reportFor.push('Replication Jobs');
  if (criteria?.includeRecoveryJobs) reportFor.push('Recovery Jobs');
  if (criteria?.includeCheckpoints) reportFor.push('Checkpoints');

  const renderScheduleSummary = () => (
    <div className="d-flex justify-content-between w-75 p-3">
      {/* Left side */}
      <div>
        <h6>{t('schedule.summarry')}</h6>
        <ul>
          <li>{getReportScheduleText(user)}</li>
          {copies && <li>{`Maintain ${copies} copies`}</li>}
        </ul>

        <h6>{t('shedule.report.summary.conf')}</h6>
        <ul>
          {reportFor.map((item, index) => (
            <li key={`${item}-${index + 1}`}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="stack__info"><div className="line" /></div>
      {/* Right side */}
      <div style={{ minWidth: '250px' }}>
        <h6>{t('email.recipient')}</h6>
        <ul>
          {configuredEmails.split(',').map((email, index) => (
            <li key={`${email.trim()}-${index + 1}`}>{email.trim()}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return <div>{renderScheduleSummary()}</div>;
};

function mapStateToProps(state) {
  const { settings, user } = state;
  return { settings, user };
}

export default connect(mapStateToProps)(withTranslation()(ReportSummaryStep));
