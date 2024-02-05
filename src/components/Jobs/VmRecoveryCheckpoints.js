import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardHeader, Col, Collapse, Container, Row } from 'reactstrap';
import DMTable from '../Table/DMTable';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import { setRecoveryCheckpoint, handleRecoveryCheckpointTableSelection } from '../../store/actions/checkpointActions';
import { RECOVERY_CHECKPOINTS } from '../../constants/TableConstants';
import { API_RECOVERY_CHECKPOINT_BY_VM } from '../../constants/ApiConstants';

function VmRecoveryCheckpoints(props) {
  const { user, protectionplanID, drPlans, jobs, dispatch, moref, vmName, renderActions } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { protectionPlan } = drPlans;
  const { localVMIP } = user;
  const { recoverySite } = protectionPlan;
  const { recoveryCheckpoints, selectedCheckpoints } = jobs;

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  if (!recoveryCheckpoints) {
    return null;
  }

  const renderIcon = () => (
    <div className="wizard-header-options">
      <div className="wizard-header-div">
        {isOpen ? <box-icon name="chevron-down" color="white" onClick={() => toggle()} style={{ height: 20 }} />
          : <box-icon name="chevron-right" color="white" onClick={() => toggle()} style={{ height: 20 }} /> }
      </div>
    </div>
  );

  const renderTable = (vms, sourceMoref) => {
    const url = API_RECOVERY_CHECKPOINT_BY_VM.replace('<id>', protectionplanID).replace('<moref>', sourceMoref);
    return (
      <Container fluid>
        <Card>
          {isOpen ? (
            <>
              <Row className="padding-top-20 padding-left-20">
                <Col sm={9}>
                  {renderActions() }
                </Col>
                <Col sm={3} className="padding-right-30">
                  <DMAPIPaginator
                    showFilter="false"
                    columns={RECOVERY_CHECKPOINTS}
                    apiUrl={url}
                    isParameterizedUrl="true"
                    storeFn={setRecoveryCheckpoint}
                    name="recoveryVMs"
                    pageLimit={5}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <DMTable
                    dispatch={dispatch}
                    columns={RECOVERY_CHECKPOINTS}
                    data={vms}
                    user={user}
                    isSelectable={localVMIP === recoverySite.node.hostname}
                    selectedData={selectedCheckpoints}
                    primaryKey="id"
                    onSelect={handleRecoveryCheckpointTableSelection}
                  />
                </Col>
              </Row>
            </>
          ) : null}

        </Card>
      </Container>
    );
  };

  return (
    <div key={`dm-accordion-${moref}`}>
      <Card className="margin-bottom-10">
        <CardHeader>
          <Row>
            <Col sm={6}>
              <span aria-hidden className="link_color" onClick={() => toggle()}>
                {vmName}
              </span>
            </Col>
            <Col sm={6} className="d-flex flex-row-reverse">
              {renderIcon()}
            </Col>
          </Row>
          <Collapse isOpen={isOpen}>
            {renderTable(recoveryCheckpoints[moref], moref)}
          </Collapse>
        </CardHeader>
      </Card>
    </div>
  );
}

export default withTranslation()(VmRecoveryCheckpoints);
