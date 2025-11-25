import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TABLE_SCHEDULE_GENERATE } from '../../constants/TableConstants';
import { valueChange } from '../../store/actions';
import { closeModal } from '../../store/actions/ModalActions';
import DMTable from '../Table/DMTable';
import { API_SCHEDULED_JOBS } from '../../constants/ApiConstants';
import { callAPI } from '../../utils/ApiUtils';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';

function ModalShowScheduledReports(props) {
  const { t, dispatch, modal } = props;
  const { options } = modal;
  const { id } = options || {};
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    let isUnmounting = false;
    const url = `${API_SCHEDULED_JOBS}/${id}`;
    callAPI(url).then(
      (json) => {
        if (isUnmounting) return;
        const filtered = Array.isArray(json) ? json.filter((item) => item.isDownloadable) : [];
        setJobData(filtered);
      },
      (err) => {
        if (isUnmounting) return;
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      },
    );
    return () => {
      isUnmounting = true;
    };
  }, [jobData.length, id]);

  function onClose() {
    dispatch(valueChange('drplan.remove.entity', false));
    dispatch(closeModal());
  }

  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t('Close')}
        {' '}
      </button>
    </div>
  );

  const renderScheduleTable = () => (
    <DMTable
      dispatch={dispatch}
      columns={TABLE_SCHEDULE_GENERATE}
      data={jobData}
    />
  );

  return (
    <>
      {renderScheduleTable()}
      {renderFooter()}
    </>
  );
}

function mapStateToProps(state) {
  const { settings } = state;
  return { settings };
}
export default connect(mapStateToProps)(withTranslation()(ModalShowScheduledReports));
