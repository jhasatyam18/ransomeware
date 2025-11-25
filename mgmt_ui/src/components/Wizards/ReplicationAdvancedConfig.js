import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Tbody, Th, Tr } from 'react-super-responsive-table';
import { Card, CardHeader, Col, Collapse, Row, Table } from 'reactstrap';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import { MODAL_REPLICATION_PRIORITY, MODAL_SET_TAGER_STORAGE, MODAL_VMWARE_QUIESCE } from '../../constants/Modalconstant';
import { openModal } from '../../store/actions/ModalActions';
import { getValue } from '../../utils/InputUtils';
import { getFilteredObject, getKeyStruct } from '../../utils/PayloadUtil';
import DMToolTip from '../Shared/DMToolTip';

function ReplicationAdvancedConfig(props) {
  const { dispatch, user, t, sites } = props;
  const { values } = user;
  const [showAdvanced, setAdvancedConfig] = useState(false);
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values) || '';
  const protectedPlatform = getValue('ui.values.protectionPlatform', values) || '';
  const result = getKeyStruct('drplan.', values);
  const rSite = sites.sites.filter((site) => getFilteredObject(site, result.drplan.recoverySite, 'id'))[0];
  const pSite = sites.sites.filter((site) => getFilteredObject(site, result.drplan.protectedSite, 'id'))[0];

  // source is not vmware or target is not aws the return null
  if (protectedPlatform !== PLATFORM_TYPES.VMware && recoveryPlatform !== PLATFORM_TYPES.AWS) {
    return null;
  }

  const toggleAdvanced = () => {
    setAdvancedConfig(!showAdvanced);
  };

  const onAWSReplPriority = () => {
    const options = { title: t('aws.configure.replication.priority'), size: 'lg' };
    dispatch(openModal(MODAL_REPLICATION_PRIORITY, options));
  };

  const onVMwareQuiesce = () => {
    const options = { title: t('title.vmware.quiesce'), size: 'lg' };
    dispatch(openModal(MODAL_VMWARE_QUIESCE, options));
  };

  const onTargetStorageClick = () => {
    const options = { title: t('target.storage.title'), size: 'lg' };
    dispatch(openModal(MODAL_SET_TAGER_STORAGE, options));
  };

  const renderIcon = () => (
    <div className="wizard-header-options">
      <div className="wizard-header-div">
        {showAdvanced ? <FontAwesomeIcon size="sm" icon={faChevronDown} onClick={toggleAdvanced} />
          : <FontAwesomeIcon size="sm" icon={faChevronRight} onClick={toggleAdvanced} />}
      </div>
    </div>
  );

  return (
    <div key="dm-accordion-adv-rep-config">
      <Card>
        <CardHeader style={{ backgroundColor: 'transparent' }}>
          <Row>
            <Col sm={1}>
              {renderIcon()}
            </Col>
            <Col sm={6}>
              <span aria-hidden className="link_color" onClick={toggleAdvanced}>
                {t('title.advance.config')}
              </span>
            </Col>
          </Row>
          <Collapse isOpen={showAdvanced}>
            <Table className="table table-bordered" id="advance-configurations">
              <Tbody>
                {protectedPlatform === PLATFORM_TYPES.VMware ? (
                  <Tr>
                    <Th>
                      {`${pSite.name} (Source)`}
                    </Th>
                    <Th>
                      <Row>
                        <Col sm={8}>
                          {t('title.vmware.quiesce')}
                        </Col>
                        <Col sm={1}>
                          <DMToolTip tooltip={t('vmware.quiesce.info')} />
                        </Col>
                      </Row>
                    </Th>
                    <Th>
                      <div className="display__flex__row">
                        <a href="#" id="configur-vmware-quiesce" onClick={onVMwareQuiesce}>
                          {t('Configure')}
                        </a>
                      </div>
                    </Th>
                  </Tr>
                ) : null}
                {recoveryPlatform === PLATFORM_TYPES.AWS ? (
                  <>
                    <Tr>
                      <Th>
                        {`${rSite.name} (Target)`}
                      </Th>
                      <Th>
                        <Row>
                          <Col sm={8}>
                            {t('replication.priority')}
                          </Col>
                          <Col sm={1}>
                            <DMToolTip tooltip={t('replication.priority.info')} />
                          </Col>
                        </Row>
                      </Th>
                      <Th>
                        <div className="display__flex__row">
                          <a href="#" id="configur-aws-replication-priority" onClick={onAWSReplPriority}>
                            {t('Configure')}
                          </a>
                        </div>
                      </Th>
                    </Tr>
                    <Tr>
                      <Th>
                        {`${rSite.name} (Target)`}
                      </Th>
                      <Th>
                        <Row>
                          <Col sm={8}>
                            {t('target.storage.title')}
                          </Col>
                          <Col sm={1}>
                            <DMToolTip tooltip={t('target.storage.info')} />
                          </Col>
                        </Row>
                      </Th>
                      <Th>
                        <div className="display__flex__row">
                          <a href="#" id="configur-aws-target-storage" onClick={onTargetStorageClick}>
                            {t('Configure')}
                          </a>
                        </div>
                      </Th>
                    </Tr>
                  </>
                ) : null}
              </Tbody>
            </Table>
          </Collapse>
        </CardHeader>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  const { sites } = state;
  return { sites };
}
export default connect(mapStateToProps)(withTranslation()(ReplicationAdvancedConfig));
