import React from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import { closeModal } from '../../store/actions/ModalActions';
import { valueChange } from '../../store/actions';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { getWarningVMS } from '../../utils/ReverseReplicationUtils';
import ReverseVMDescriptionRenderer from '../Table/ItemRenderers/ReverseVMDescriptionRenderer';

const ModalReverseChangesWarning = (props) => {
  const { t, dispatch, user } = props;
  const vmsDetails = getWarningVMS(user);
  const onClose = () => {
    dispatch(closeModal());
  };

  const onConfirm = () => {
    dispatch(valueChange(STATIC_KEYS.UI_DMWIZARD_MOVENEXT, true));
    dispatch(closeModal());
  };

  function renderFooter() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          {t('cancel')}
        </button>
        <button type="button" className="btn btn-success" onClick={onConfirm}>
          {t('accept.and.continue')}
        </button>
      </div>
    );
  }

  const alertMessage = () => (
    <Row>
      <Col sm={2} className="display-4"><i className="fas fa-exclamation-triangle icon__warning ml-4" aria-hidden="true" /></Col>
      <Col className="text-warning pt-2">
        <p className="pb-0 mb-0">{t('reverse.change.value.warning.msg.one')}</p>
        <p>{t('reverse.change.value.warning.msg.two')}</p>
      </Col>
    </Row>
  );

  const renderDiffTable = () => (
    <div className="table-responsive pl-3 pr-3 mt-3 mb-3">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th rowSpan="2">{t('workload')}</th>
            <th colSpan="2" className="text-center">{t('entity.type')}</th>
            <th colSpan="2" className="text-center">{t('replication.type')}</th>
            <th rowSpan="2" className="w-25">{t('impact')}</th>
          </tr>
          <tr>
            <th>{t('recommended')}</th>
            <th>{t('configured')}</th>
            <th>{t('recommended')}</th>
            <th>{t('configured')}</th>
          </tr>
        </thead>
        <tbody>
          {vmsDetails.length > 0 && vmsDetails.map((el) => (
            <tr className="text-muted">
              <td>{el.name}</td>
              <td>{el.recommendedEntityType}</td>
              <td>{el.selectedEntityType}</td>
              <td>{el.recommendedReplType}</td>
              <td>{el.selectedReplType}</td>
              <td>{ReverseVMDescriptionRenderer({ data: el, user })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="modal-body">
        {alertMessage()}
        {renderDiffTable()}
      </div>
      {renderFooter()}
    </>
  );
};

export default (withTranslation()(ModalReverseChangesWarning));
