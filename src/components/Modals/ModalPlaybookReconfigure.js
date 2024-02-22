import React from 'react';
import { CardBody, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import SimpleBar from 'simplebar-react';
import { onCreatePlanFromPlaybook } from '../../store/actions/DrPlaybooksActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { refresh } from '../../store/actions';
import { getValue } from '../../utils/InputUtils';
import { closeModal } from '../../store/actions/ModalActions';
import { STATIC_KEYS } from '../../constants/InputConstants';
import ShowPlaybookVmChanges from '../Playbook/ShowPlaybookVmChanges';

function ModalPlaybookReconfigure({ dispatch, user, options, t }) {
  const { values } = user;
  const protectionPlanChanges = getValue('plan', values) || [];
  const { message, planId, playbookId } = options;

  const data = getValue(STATIC_KEYS.UI_PLAYBOOK_DIFF, values);
  if (protectionPlanChanges.length === 0 && (Object.keys(data.changes).length === 0 && Object.keys(data.add).length === 0 && Object.keys(data.delete).length === 0)) {
    dispatch(closeModal());
    dispatch(refresh());
    dispatch(addMessage('There are no changes in the configuration', MESSAGE_TYPES.INFO));
    return null;
  }

  if (!protectionPlanChanges) {
    return null;
  }
  if (Object.keys(data).length === 0) {
    return null;
  }

  const onClose = () => {
    dispatch(closeModal());
  };

  const onCreatePplanClick = () => {
    dispatch(onCreatePlanFromPlaybook(playbookId));
  };

  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t('close')}
      </button>
      <button type="button" className="btn btn-success" onClick={onCreatePplanClick}>
        { planId > 0 ? t('title.edit.pplan') : t('confirm')}
      </button>
    </div>
  );

  const renderVmChanges = ({ key, changedData, add, deletedVm }) => {
    const title = key.split('-name-');
    return <ShowPlaybookVmChanges data={changedData} id={title[1]} add={add} deletedData={deletedVm} />;
  };
  return (
    <>
      <div key="dm-accordion-title" className="padding-10 width-50">
        <Row>
          <div className="col-sm-11 confirmation_modal_msg padding-top-10 ">
            <i className="fas fa-exclamation-triangle padding-right-10 padding-left-20 text-warning" />
            {message}
          </div>
        </Row>
        <SimpleBar style={{ minHeight: '50vh', maxHeight: '50vh' }}>
          <CardBody className="">
            <ShowPlaybookVmChanges data={protectionPlanChanges} type="protection" />
            {Object.keys(data.changes).map((ch) => renderVmChanges({ key: ch, changedData: data.changes[ch] }))}
            {Object.keys(data.add).map((ch) => renderVmChanges({ key: ch, changedData: data.add[ch], add: true }))}
            {Object.keys(data.delete).map((ch) => renderVmChanges({ key: ch, changedData: data.delete[ch], deletedVm: true }))}
          </CardBody>
        </SimpleBar>
      </div>
      {renderFooter()}
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ModalPlaybookReconfigure));
