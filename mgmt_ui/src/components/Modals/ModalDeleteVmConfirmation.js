import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions';
import { fetchCheckpointsByPlanId } from '../../store/actions/checkpointActions';
import { closeModal } from '../../store/actions/ModalActions';

function DeletVMConfirmation(props) {
  const { modal, t, dispatch, user } = props;
  const { values } = user;
  const { options } = modal;
  const { message, vmName, protectionPlan } = options;
  const { id } = protectionPlan;
  const history = useNavigate();
  const removeEntity = getValue('drplan.remove.entity', values) || false;
  useEffect(() => {
    dispatch(fetchCheckpointsByPlanId(id));
  }, []);

  function onClose() {
    dispatch(valueChange('drplan.remove.entity', false));
    dispatch(closeModal());
  }

  function onConfirm() {
    const { confirmAction } = options;
    dispatch(confirmAction(id, history));
  }

  const handleChange = (key, e) => {
    dispatch(valueChange(key, e.target.checked));
  };

  function renderFooter() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          {t('Close')}
          {' '}
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm}>{t('Confirm')}</button>
      </div>
    );
  }
  return (
    <>
      <div className="modal-body noPadding mb-2">
        <Row className="margin-left-10 margin-top-15">
          <Col sm={12} className="d-flex flex-direction-column justify-content-center">
            <span>
              <FontAwesomeIcon style={{ fontSize: '40px' }} size="lg" className="margin-right-5 text-warning mr-2" icon={faExclamationTriangle} />
            </span>
            <h1 className="text-warning font-weight-bold lead padding-top-3 margin-left-2">
              {message}
            </h1>
          </Col>
        </Row>
        {vmName && Object.keys(vmName).length > 0 ? (
          <Row>
            <Col sm={1} />
            <Col sm={11}>
              <SimpleBar style={{ minHeight: '30px', maxHeight: '200px', padding: '4px' }}>
                <ul className=" margin-top-5">
                  {Object.keys(vmName).map((el) => (
                    <li className="pr-2" id={`${vmName[el].name.trim(' ')}`}>
                      <span>{vmName[el].name}</span>
                    </li>
                  ))}
                </ul>

              </SimpleBar>
            </Col>
          </Row>
        ) : null}
        <Row className="padding-bottom-5">
          <Col sm={1} />
          <Col sm={10} className="margin-left-25">
            <div className="pt-2 mb-1">
              <div className="form-check">
                <input type="checkbox" checked={removeEntity} className="form-check-input" id="drplan.remove.entity" name="drplan.remove.entity" onChange={(e) => handleChange('drplan.remove.entity', e)} />
                <label className="form-check-label" htmlFor="drplan.remove.entity">
                  <span style={{ fontSize: '12px' }}>{t('delete.vm.infra')}</span>
                </label>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {renderFooter()}
    </>
  );
}

function mapStateToProps(state) {
  const { drPlans, jobs } = state;
  return { drPlans, jobs };
}
export default connect(mapStateToProps)(withTranslation()(DeletVMConfirmation));
