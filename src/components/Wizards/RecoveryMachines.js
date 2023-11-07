import React, { Component } from 'react';
import { Col, Label, Row, Container } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import DMTable from '../Table/DMTable';
import DMTPaginator from '../Table/DMTPaginator';
import DMField from '../Shared/DMField';
import { handleProtectVMSeletion, handleSelectAllRecoveryVMs } from '../../store/actions/SiteActions';
import { TABLE_FILTER_TEXT, TABLE_RECOVERY_VMS } from '../../constants/TableConstants';
import { STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { getValue } from '../../utils/InputUtils';
import { filterData } from '../../utils/AppUtils';

class RecoveryMachines extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [], hasFilterString: false, searchData: [] };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  onFilter(criteria) {
    const { user } = this.props;
    const { values } = user;
    const vms = getValue('ui.recovery.vms', values);
    if (criteria === '') {
      this.setState({ hasFilterString: false, searchData: [] });
    } else {
      const newData = filterData(vms, criteria, TABLE_RECOVERY_VMS);
      this.setState({ hasFilterString: true, searchData: newData });
    }
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  render() {
    const { dispatch, user, t } = this.props;
    const { values } = user;
    const { hasFilterString, searchData, dataToDisplay } = this.state;
    const vms = getValue('ui.recovery.vms', values);
    let selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
    const data = (hasFilterString ? searchData : vms);
    let title = '';
    if (!selectedVMs) {
      selectedVMs = {};
    }
    const isMigrationWorkflow = getValue('ui.isMigration.workflow', values);
    const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values) || '';
    let columns = [];
    if (workflow === UI_WORKFLOW.CLEANUP_TEST_RECOVERY) {
      columns = TABLE_RECOVERY_VMS.filter((col) => col.label !== 'Username' && col.label !== 'Password');
    } else {
      columns = TABLE_RECOVERY_VMS;
    }
    if (isMigrationWorkflow) {
      title = t('title.machines.migration');
    } else if (workflow === UI_WORKFLOW.CLEANUP_TEST_RECOVERY) {
      title = t('title.cleanup.test.recovery');
    } else if (workflow === UI_WORKFLOW.TEST_RECOVERY) {
      title = t('title.test.recovery');
    } else {
      title = t('title.machines.recovery');
    }
    return (
      <Container fluid className="padding-10">
        <br />
        <Label>{title}</Label>
        <br />
        <Row>
          <Col sm={12} className="padding-left-30">
            {isMigrationWorkflow ? <DMField dispatch={dispatch} user={user} fieldKey="ui.automate.migration" key="ui.automate.migration" /> : null}
          </Col>
          <Col className="margin-left-30 padding-right-30 margin-right-10">
            <DMTPaginator
              defaultLayout="true"
              data={data}
              setData={this.setDataForDisplay}
              showFilter="true"
              onFilter={this.onFilter}
              columns={columns}
              filterHelpText={TABLE_FILTER_TEXT.TABLE_RECOVERY_VMS}
            />
          </Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={columns}
          data={dataToDisplay}
          isSelectable
          onSelect={handleProtectVMSeletion}
          selectedData={selectedVMs}
          primaryKey="moref"
          name="recoveryvms"
          onSelectAll={handleSelectAllRecoveryVMs}
          user={user}
        />
      </Container>
    );
  }
}

export default (withTranslation()(RecoveryMachines));
