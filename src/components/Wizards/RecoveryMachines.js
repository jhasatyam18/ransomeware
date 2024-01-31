import React, { Component } from 'react';
import { Col, Label, Row, Container } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import DMTable from '../Table/DMTable';
import DMTPaginator from '../Table/DMTPaginator';
import DMField from '../Shared/DMField';
import DMToolTip from '../Shared/DMToolTip';
import { handleProtectVMSeletion, handleSelectAllRecoveryVMs } from '../../store/actions/SiteActions';
import { TABLE_FILTER_TEXT, TABLE_RECOVERY_VMS } from '../../constants/TableConstants';
import { PLAYBOOK_TYPE, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { getValue } from '../../utils/InputUtils';
import { filterData } from '../../utils/AppUtils';
import { getUrlPath } from '../../utils/ApiUtils';
import { API_UPLOAD_TEMPLATED } from '../../constants/ApiConstants';
import { hideApplicationLoader, showApplicationLoader, valueChange } from '../../store/actions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';

class RecoveryMachines extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [], hasFilterString: false, searchData: [], recFileName: '' };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.resetCredentialFile = this.resetCredentialFile.bind(this);
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

  onFileChange = (e) => {
    const { dispatch } = this.props;
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const fileName = e.target.files[0].name;
    this.setState({ recFileName: fileName });
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('name', fileName);
    formData.append('type', PLAYBOOK_TYPE.RECOVERY);
    const url = getUrlPath(API_UPLOAD_TEMPLATED);
    dispatch(showApplicationLoader('UPLOADING_RECOVERY_CREDENTIALS', 'Uploading recovery credentials...'));
    fetch(url, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (response.ok) {
        dispatch(hideApplicationLoader('UPLOADING_RECOVERY_CREDENTIALS'));
        dispatch(valueChange('ui.recovery.credentials.fileName', fileName));
        dispatch(addMessage('Recovery credentials uploaded successfully', MESSAGE_TYPES.SUCCESS));
      } else {
        dispatch(hideApplicationLoader('UPLOADING_RECOVERY_CREDENTIALS'));
        response.text().then((text) => {
          dispatch(addMessage(text, MESSAGE_TYPES.ERROR));
        });
      }
    })
      .catch((err) => {
        dispatch(hideApplicationLoader('UPLOADING_RECOVERY_CREDENTIALS'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };

  resetCredentialFile = (e) => {
    e.preventDefault();
    this.setState({ recFileName: '' });
  };

  renderRemoveFile() {
    const { recFileName } = this.state;
    if (recFileName === '') {
      return null;
    }
    return (
      <a href="#" onClick={this.resetCredentialFile}>
        <i className="fas fa-window-close text-danger" />
      </a>
    );
  }

  render() {
    const { dispatch, user, t } = this.props;
    const { values } = user;
    const { hasFilterString, searchData, dataToDisplay, recFileName } = this.state;
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
          <Col sm={6} className="margin-left-30">
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
          {workflow !== UI_WORKFLOW.CLEANUP_TEST_RECOVERY ? (
            <Col sm={5}>
              <div className="container-display-recovery">
                <div href="#">
                  <label htmlFor="credentialUpload" className="label text-success">
                    <i className="fas fa-upload" />
                  &nbsp;
                  &nbsp;
                    {recFileName === '' ? t('title.upload.recovery.file') : recFileName}
                  </label>
                  <input accept=".xlsx" type="file" id="credentialUpload" name="credentialUpload" style={{ visibility: 'none', display: 'none' }} onSelect={this.onFileChange} onChange={this.onFileChange} />
                </div>
                {this.renderRemoveFile()}
                <DMToolTip tooltip="title.upload.recovery.file.tooltip" />
              </div>
            </Col>
          ) : null}
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
