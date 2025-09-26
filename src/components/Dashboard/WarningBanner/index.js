import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { node } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { fetchNodes } from '../../../store/actions/NodeActions';
import { NODES_PATH, PROTECTION_PLANS_PATH } from '../../../constants/RouterConstants';
import { fetchDrPlans } from '../../../store/actions/DrPlanActions';
import { getValue } from '../../../utils/InputUtils';
import { KEY_CONSTANTS } from '../../../constants/UserConstant';
import { NODE_STATUS, NODE_TYPES } from '../../../constants/InputConstants';
import { valueChange } from '../../../store/actions';

const WarningMessage = (props) => {
  const { settings, t, dispatch, global, user } = props;
  const { nodes } = settings;
  const { values } = user;
  let localNodeversion = '';
  const [componentInd, setComponentInd] = useState(0);
  const [componentArray, setComponentArray] = useState([]);

  const { replDisabledPlanCount, replDisabledVmCount } = getValue('repl.disable.msg', global?.warningBannerMessages);

  useEffect(() => {
    dispatch(fetchNodes());
    dispatch(fetchDrPlans());
  }, [dispatch]);

  const nodeVersionMismatchError = () => (
    <>
      <span>{t('node.versions.mismatch.warning', { localNodeversion })}</span>
      &nbsp;
      <span>{t('Visit the')}</span>
      &nbsp;
      <Link to={NODES_PATH}>{t('Nodes page ')}</Link>
      &nbsp;
      <span>{t('to perform the upgrade.')}</span>
    </>
  );

  const replDisabledPlanListError = () => (
    <>
      <span className="me-2">
        {`${replDisabledPlanCount} protection ${replDisabledPlanCount > 1 ? 'plans are' : 'plan is'} in a partially running state as replication is disabled for ${replDisabledVmCount} ${replDisabledVmCount === 1 ? 'workload' : 'workloads'}. ${replDisabledVmCount === 1 ? 'This workload' : 'These workloads'} will recover from an older sync point, while others use the latest, potentially causing a recovery time mismatch`}
      </span>
      <span>{t('Visit the')}</span>
      &nbsp;
      <Link to={PROTECTION_PLANS_PATH}>{t('Plans page ')}</Link>
      &nbsp;
    </>
  );

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < nodes.length; i += 1) {
      if (nodes[i].nodeType !== NODE_TYPES.PrepNode || (nodes[i].nodeType === NODE_TYPES.MANAGEMENT && node.isLocalNode)) {
        localNodeversion = localNodeversion < nodes[i].version ? nodes[i].version : localNodeversion;
      }
    }
    const isUpgradeRequired = nodes.filter((el) => (el.isUpgradeRequired && el.status === NODE_STATUS.Online));
    if (isUpgradeRequired.length !== 0) arr.push({ component: nodeVersionMismatchError, isClose: false });
    const closedBanner = getValue('ui.close.banner', values);
    if (replDisabledVmCount > 0 && !closedBanner?.partiallyRunning) arr.push({ component: replDisabledPlanListError, isClose: true });
    setComponentArray(arr);
    setComponentInd(0);
  }, [nodes, replDisabledPlanCount, replDisabledVmCount, t]);

  const onPaginationClick = (flow) => {
    if (flow === KEY_CONSTANTS.DESCREASE) {
      if (componentInd === 0) return;
      setComponentInd((prev) => prev - 1);
    }
    if (flow === KEY_CONSTANTS.INCREASE) {
      if (componentInd === componentArray.length - 1) return;
      setComponentInd((prev) => prev + 1);
    }
  };

  const onCloseClick = () => {
    setComponentArray((prev) => {
      const newArr = prev.filter((_, i) => i !== componentInd);
      if (componentInd >= newArr.length) {
        setComponentInd(newArr.length - 1);
        dispatch(valueChange('ui.close.banner', { partiallyRunning: true }));
      }
      return newArr;
    });
  };
  if (componentArray.length === 0 || componentInd < 0 || !componentArray[componentInd]) {
    return null;
  }
  return (
    <Card className="mb-0">
      <CardBody style={{ backgroundColor: '#d9a64f', borderRadius: '2px', color: 'black', fontSize: '14px', fontWeight: '390', padding: '5px', overflowX: 'hidden' }}>
        <Row className="ms-2">
          <Col sm={11}>{componentArray[componentInd].component()}</Col>
          <Col sm={1} className="d-flex " style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="text-container" style={{ width: '100%', justifyContent: 'center' }}>
              <Row className="mb-0">
                <Col className="margin-0 display__flex__reverse padding-right-20 align-items-center">
                  {componentArray[componentInd]?.isClose ? (
                    <FontAwesomeIcon style={{ color: '#32394e', fontSize: '1rem', position: 'relative', left: '20px', top: '-1px' }} onClick={onCloseClick} size="sm" icon={faXmarkCircle} className="padding-4 cursor-pointer" />
                  ) : null}
                  <FontAwesomeIcon size="xs" onClick={() => onPaginationClick(KEY_CONSTANTS.INCREASE)} icon={faChevronRight} className="padding-4 cursor-pointer" />
                  <span>
                    {`${componentInd + 1} / ${componentArray.length}`}
                  </span>
                  <FontAwesomeIcon size="xs" onClick={() => onPaginationClick(KEY_CONSTANTS.DESCREASE)} icon={faChevronLeft} className="padding-4 cursor-pointer" />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { settings, user, drPlans, global } = state;
  return { settings, user, drPlans, global };
};

export default connect(mapStateToProps)(withTranslation()(WarningMessage));
