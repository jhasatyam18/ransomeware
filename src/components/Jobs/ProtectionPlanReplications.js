import { faCheckCircle, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { PROTECTION_PLANS_STATUS } from '../../constants/InputConstants';
import { KEY_CONSTANTS, PLAN_REPL_RPO } from '../../constants/UserConstant';
import { TABLE_PROTECTION_PLAN_REPLICATIONS } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';

function ProtectionPlanReplications(props) {
  const [isOpen, setisOpen] = useState(false);
  const { plan, t, dispatch } = props;
  const { configuredRPO, rpoStatus, inSyncCount, vms, name, enablePPlanLevelScheduling } = plan;

  function toggle() {
    setisOpen(!isOpen);
  }

  function renderIcon() {
    return (
      <div className="wizard-header-options">
        <div className="wizard-header-div">
          {isOpen ? <FontAwesomeIcon size="sm" icon={faChevronDown} onClick={toggle} />
            : <FontAwesomeIcon size="sm" icon={faChevronRight} onClick={toggle} />}
        </div>
      </div>
    );
  }

  function renderTable() {
    return (
      <DMTable auto="true" columns={TABLE_PROTECTION_PLAN_REPLICATIONS} data={vms} dispatch={dispatch} />
    );
  }

  function drPlanStatus() {
    const { status } = plan;
    let newStatus = status;
    if (status === PROTECTION_PLANS_STATUS.STARTED) {
      for (let i = 0; i < vms.length; i += 1) {
        const vm = vms[i];
        if (vm.replicationStatus === KEY_CONSTANTS.DISABLED) {
          newStatus = PROTECTION_PLANS_STATUS.PARTIALLY_RUNNING;
          break;
        }
      }
    }
    return newStatus;
  }
  function renderStatus() {
    const newStatus = drPlanStatus(plan);
    if (newStatus === PROTECTION_PLANS_STATUS.STOPPED) {
      return (
        <Badge pill color="danger">{t('status.stopped')}</Badge>
      );
    }
    if (newStatus === PROTECTION_PLANS_STATUS.INIT_FAILED) {
      return (
        <Badge pill color="danger">{t('status.init.failed')}</Badge>
      );
    }
    if (newStatus === PROTECTION_PLANS_STATUS.INITIALIZING) {
      return (
        <Badge pill color="info">{t('status.initializing')}</Badge>
      );
    }
    if (newStatus === PROTECTION_PLANS_STATUS.CREATED || newStatus === PROTECTION_PLANS_STATUS.STARTED) {
      return (
        <Badge color="info" pill>{t('status.running')}</Badge>
      );
    }
    if (newStatus === PROTECTION_PLANS_STATUS.PARTIALLY_RUNNING) {
      return (
        <Badge color="warning" pill>{t('plan.status.partially.running')}</Badge>
      );
    }

    return (
      <Badge pill color="info">{t('status.running')}</Badge>
    );
  }

  return (
    <div key={`dm-accordion-${name}`}>
      <Card className="margin-bottom-10">
        <CardHeader>
          <Row onClick={toggle} className="cursor-pointer">
            <Col sm={6}>
              <span aria-hidden className="link_color me-2">
                {name}
              </span>
              {renderStatus()}
            </Col>
            <Col sm={6} className="d-flex flex-row-reverse">
              {renderIcon()}
              <span className="ms-3 me-3 link_color">{`In-Sync : ${inSyncCount}`}</span>
              <span className={`ms-3 text-${PLAN_REPL_RPO[rpoStatus]}`}>{`RPO ${configuredRPO} ${configuredRPO > 1 ? 'mins' : 'min'} : ${t(rpoStatus)}`}</span>
              {enablePPlanLevelScheduling ? (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} size="xs" className="text-success mt-1 ms-1" />
                  <span className="ms-2" style={{ fontSize: '10px' }}>
                    Synchronize All VM Replications
                  </span>
                </>
              ) : null}
            </Col>
          </Row>
          <Collapse isOpen={isOpen}>
            <CardBody className="padding-left-0 padding-right-0">
              {renderTable(vms)}
            </CardBody>
          </Collapse>
        </CardHeader>
      </Card>
    </div>
  );
}

export default ProtectionPlanReplications;
