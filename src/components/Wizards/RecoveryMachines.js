import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Container, Label, Row } from 'reactstrap';
import { API_UPLOAD_RECOVERY_CRED } from '../../constants/ApiConstants';
import { RECOVERY_STATUS } from '../../constants/AppStatus';
import { FIELDS } from '../../constants/FieldsConstant';
import { CHECKPOINT_TYPE, CONSTANT_NUMBERS, PLAYBOOK_TYPE, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { TABLE_FILTER_TEXT, TABLE_RECOVERY_VMS } from '../../constants/TableConstants';
import { hideApplicationLoader, showApplicationLoader, valueChange } from '../../store/actions';
import { setRecoveryVMDetails } from '../../store/actions/DrPlanActions';
import { addMessage } from '../../store/actions/MessageActions';
import { handleProtectVMSeletion, handleSelectAllRecoveryVMs } from '../../store/actions/SiteActions';
import { getUrlPath } from '../../utils/ApiUtils';
import { filterData } from '../../utils/AppUtils';
import { getValue } from '../../utils/InputUtils';
import DMField from '../Shared/DMField';
import DMSearchSelect from '../Shared/DMSearchSelect';
import DMToolTip from '../Shared/DMToolTip';
import DMTable from '../Table/DMTable';
import DMTPaginator from '../Table/DMTPaginator';

class RecoveryMachines extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [], hasFilterString: false, searchData: [], recFileName: '', recoveryType: CHECKPOINT_TYPE.LATEST };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
    this.resetCredentialFile = this.resetCredentialFile.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    const { values } = user;
    const selectedRecoveryType = getValue(STATIC_KEYS.UI_CHECKPOINT_RECOVERY_TYPE, values);
    if (selectedRecoveryType !== '') {
      this.setState({ recoveryType: selectedRecoveryType });
    } else {
      this.setState({ recoveryType: CHECKPOINT_TYPE.LATEST });
    }
  }

  onFilter(criteria) {
    const { user } = this.props;
    const { values } = user;
    const vms = getValue(STORE_KEYS.UI_RECOVERY_VMS, values);
    if (criteria.trim() === '') {
      this.setState({ hasFilterString: false, searchData: [] });
    } else {
      const newData = filterData(vms, criteria.trim(), TABLE_RECOVERY_VMS);
      this.setState({ hasFilterString: true, searchData: newData });
    }
  }

  onCheckointTypeChange(value) {
    const { dispatch, user } = this.props;
    const { values } = user;
    this.setState({ recoveryType: value });
    dispatch(valueChange(STATIC_KEYS.UI_CHECKPOINT_RECOVERY_TYPE, value));
    this.setRecoveryConfigs(dispatch, values, value);
  }

  setRecoveryConfigs(dispatch, values, value) {
    const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
    const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
    const recVms = getValue(STORE_KEYS.UI_RECOVERY_VMS, values);
    const data = [];
    if (value === CHECKPOINT_TYPE.LATEST) {
      recVms.forEach((vm) => {
        const virtualMachine = vm;
        if (typeof vm.recoveryStatus !== 'undefined' && (vm.recoveryStatus === RECOVERY_STATUS.MIGRATED || vm.recoveryStatus === RECOVERY_STATUS.RECOVERED || vm.isRemovedFromPlan === true)) {
          // hide checkbox if the vm is recovered
          virtualMachine.isDisabled = true;
          // if the recovered vm is selected in point-in-time and the user clicks on latest then remove recovered vm from selected vm
          delete vms[vm.moref];
        }
        data.push(virtualMachine);
      });
      dispatch(valueChange(STORE_KEYS.UI_RECOVERY_VMS, data));
      dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, vms));
      // after clicking on latest the recovery config should get updated as per latest data from the store
      if (workflow === UI_WORKFLOW.RECOVERY) {
        Object.keys(vms).forEach((vm) => {
          dispatch(setRecoveryVMDetails(vm));
        });
      }
      // REMOVE CHECKPOINT WARNING TEXT
      dispatch(valueChange(STORE_KEYS.UI_CHECKPOINT_SELECT_WARNING, ''));
    } else if (value === CHECKPOINT_TYPE.POINT_IN_TIME) {
      recVms.forEach((vm) => {
        const virtualMachine = vm;
        if (typeof vm.recoveryStatus !== 'undefined' && (vm.recoveryStatus === RECOVERY_STATUS.RECOVERED || vm.isRemovedFromPlan === true)) {
          // below code is to enable vm selection for point-in-time even if it's recovered
          virtualMachine.isDisabled = false;
        }
        data.push(virtualMachine);
      });
      dispatch(valueChange(STORE_KEYS.UI_RECOVERY_VMS, data));
      const plan = getValue(STORE_KEYS.UI_CHECKPOINT_PLAN, values);
      if (Object.keys(plan).length > 0) {
        Object.keys(vms).forEach((vm) => {
          dispatch(setRecoveryVMDetails(vm, plan));
        });
      }
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
    const url = getUrlPath(API_UPLOAD_RECOVERY_CRED);
    dispatch(showApplicationLoader('UPLOADING_RECOVERY_CREDENTIALS', 'Uploading recovery credentials...'));
    fetch(url, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (response.ok) {
        dispatch(hideApplicationLoader('UPLOADING_RECOVERY_CREDENTIALS'));
        dispatch(valueChange('ui.recovery.credentials.fileName', fileName));
        dispatch(addMessage('Recovery credentials uploaded successfully', MESSAGE_TYPES.SUCCESS));
        e.target.value = '';
      } else {
        dispatch(hideApplicationLoader('UPLOADING_RECOVERY_CREDENTIALS'));
        response.text().then((text) => {
          dispatch(addMessage(text, MESSAGE_TYPES.ERROR));
          e.target.value = '';
        });
      }
    })
      .catch((err) => {
        dispatch(hideApplicationLoader('UPLOADING_RECOVERY_CREDENTIALS'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        e.target.value = '';
      });
  };

  resetCredentialFile = (e) => {
    e.preventDefault();
    this.setState({ recFileName: '' });
  };

  RenderOptions() {
    const { t, user } = this.props;
    const { values } = user;
    const { recoveryType } = this.state;
    const disablePointInTime = getValue(STATIC_KEYS.IS_POINT_IN_TIME_DISABLED, values);
    const disableLatest = getValue(STATIC_KEYS.DISABLE_RECOVERY_FROM_LATEST, values);
    return (
      <Row className="margin-top-20">
        <Col sm={4} className="padding-left-30">{t('recover.from')}</Col>
        <Col sm={8}>
          <div className="form-check-inline pr-4 pl-3">
            <p className="form-check-label">
              <input type="radio" disabled={disableLatest} className="form-check-input" name="recoveryType" value={CHECKPOINT_TYPE.LATEST} checked={recoveryType === CHECKPOINT_TYPE.LATEST} onChange={(e) => this.onCheckointTypeChange(e.target.value)} />
              {t('test.recovery.latest')}
            </p>
          </div>
          <div className="form-check-inline">
            <p className="form-check-label fs-30">
              <input type="radio" disabled={disablePointInTime} className="form-check-input" name="recoveryType" value={CHECKPOINT_TYPE.POINT_IN_TIME} checked={recoveryType === CHECKPOINT_TYPE.POINT_IN_TIME} onChange={(e) => this.onCheckointTypeChange(e.target.value)} />
              {t('test.recovery.pointInTime')}
            </p>
          </div>
        </Col>
      </Row>
    );
  }

  renderCommonCheckpointOption() {
    const { dispatch, user, t } = this.props;
    const commonCheckpointField = FIELDS['ui.common.checkpoint'];
    return (
      <Row className="margin-top-20">
        <Col sm={4} className="padding-left-30">{t('select.point.in.time')}</Col>
        <Col sm={5}>
          <DMSearchSelect className="w-20" fieldKey="ui.unique.checkpoint.field" field={commonCheckpointField} user={user} dispatch={dispatch} hideLabel />
        </Col>
      </Row>
    );
  }

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
    const { hasFilterString, searchData, dataToDisplay, recFileName, recoveryType } = this.state;
    const vms = getValue(STORE_KEYS.UI_RECOVERY_VMS, values);
    let selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
    const data = (hasFilterString ? searchData : vms);
    const planHasCheckpoints = getValue(STATIC_KEYS.UI_RECOVERY_CHECKPOINTS_BY_VM_ID, values) || [];
    let title = '';
    if (!selectedVMs) {
      selectedVMs = {};
    }
    const isMigrationWorkflow = getValue('ui.isMigration.workflow', values);
    const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values) || '';
    const checkpointWarning = t('recovery.checkpoint.onchange.warn');
    let columns = [];
    if (workflow === UI_WORKFLOW.CLEANUP_TEST_RECOVERY) {
      columns = TABLE_RECOVERY_VMS.filter((col) => col.label !== 'Username' && col.label !== 'Password' && col.label !== 'Point In Time')
        .map((col) => ({ ...col }));
      columns[0].width = '7';
      columns[1].width = '4';
    } else if ((workflow === UI_WORKFLOW.TEST_RECOVERY || workflow === UI_WORKFLOW.RECOVERY) && recoveryType === CHECKPOINT_TYPE.POINT_IN_TIME) {
      // Recovery type is point-in-time then add option to select checkpoint column
      columns = [...TABLE_RECOVERY_VMS];
      columns[3].field = '';
    } else {
      columns = TABLE_RECOVERY_VMS.map((el) => ({ ...el }));
      columns[3].field = 'currentSnapshotTime';
      columns[3].width = '2';
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

    const renderWarningMsg = () => (
      <>
        <div className="padding-left-20 card_note_warning">
          {checkpointWarning}
        </div>
      </>
    );

    const getRecFileName = (fileName) => {
      if (fileName.length > CONSTANT_NUMBERS.TWENTY_FIVE) {
        return `${fileName.substring(CONSTANT_NUMBERS.ZERO, CONSTANT_NUMBERS.TWENTY_FIVE)}...`;
      }
      return fileName;
    };

    return (
      <Container fluid className="padding-10">
        {(workflow === UI_WORKFLOW.TEST_RECOVERY || workflow === UI_WORKFLOW.RECOVERY) && Object.keys(planHasCheckpoints).length > 0
          ? (
            <>
              {this.RenderOptions()}
              {recoveryType === CHECKPOINT_TYPE.POINT_IN_TIME && this.renderCommonCheckpointOption()}
              {recoveryType === CHECKPOINT_TYPE.POINT_IN_TIME ? renderWarningMsg() : null}
            </>
          )
          : null}
        <br />
        <Label className="padding-left-20">{title}</Label>
        <br />
        <Row>
          <Col sm={12} className="padding-left-30">
            {isMigrationWorkflow ? <DMField dispatch={dispatch} user={user} fieldKey="ui.automate.migration" key="ui.automate.migration" /> : null}
          </Col>
          <Col sm={5} className="margin-left-30">
            <DMTPaginator
              id="recoverymachine"
              defaultLayout="true"
              data={data}
              setData={this.setDataForDisplay}
              showFilter="true"
              onFilter={this.onFilter}
              columns={columns}
              filterHelpText={TABLE_FILTER_TEXT.TABLE_RECOVERY_VMS}
            />
          </Col>
          <Col sm={2} />
          {workflow !== UI_WORKFLOW.CLEANUP_TEST_RECOVERY ? (
            <Col sm={4} className="margin-left-13">
              <div className="container-display-recovery">
                <div href="#">
                  <label htmlFor="credentialUpload" className="label text-success" title={recFileName}>
                    <i className="fas fa-upload" />
                  &nbsp;
                  &nbsp;
                    {recFileName === '' ? t('title.upload.recovery.file') : getRecFileName(recFileName)}
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
