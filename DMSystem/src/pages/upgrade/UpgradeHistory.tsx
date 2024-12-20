import { faCheckCircle, faChevronDown, faChevronRight, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Col, Row } from 'reactstrap';
import { UpgradeNodeInterface } from '../../interfaces/HistoryInterface';
import { NodeInterface } from '../../interfaces/interfaces';
import { UpgradeHistoryInterface } from '../../interfaces/upgradeInterfaces';
import { deepCopy, hasRequestedPrivileges } from '../../utils/appUtils';
import { getValue } from '../../utils/inputUtils';
import { INIT_REVERT, INIT_UPGRADE, JOB_COMPLETION_STATUS, JOB_FAILED, OFFLINE } from '../../Constants/statusConstant';
import { UPGRADE_REVERT } from '../../Constants/upgradeConstant';
import { STATIC_KEYS } from '../../Constants/userConstants';
import { valueChange } from '../../store/actions';
import { addUpgradeStep, getUpgradeHistory } from '../../store/actions/upgradeAction';
import UpgradeDetails from './UpgradeDetails';

const UpgradeHistory = (props: any) => {
    const { t, showSummary, user, dispatch } = props;
    const { values } = user;
    const [openRows, setOpenRows] = useState<Record<string, boolean>>({});
    const historyData = getValue(STATIC_KEYS.UI_SELECTED_UPGRADE_HISTORY_LIST, values) || [];
    const nodeInfo = getValue(STATIC_KEYS.UI_FTECH_NODE_INFO, values);
    let upgradeSuccessfull = false;

    useEffect(() => {
        dispatch(getUpgradeHistory());
    }, []);

    nodeInfo.forEach((nodeIn: NodeInterface) => {
        historyData.forEach((histNode: UpgradeNodeInterface) => {
            if (nodeIn.name === histNode.nodeName) {
                historyData.status = nodeIn.status;
            }
        });
    });

    const onRevertClick = (e: React.MouseEvent, el: UpgradeHistoryInterface) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, STATIC_KEYS.UI_UPGRADE));
        dispatch(valueChange(STATIC_KEYS.UI_CURRENT_FLOW, STATIC_KEYS.REVERT));
        dispatch(valueChange(STATIC_KEYS.UPGRADE_HISTORY_PREVIEW_NODE_INFO, el));
        dispatch(addUpgradeStep(deepCopy(UPGRADE_REVERT)));
    };

    const toggleRow = (rowId: string) => {
        setOpenRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId], // Toggle the specific row
        }));
    };

    const renderIcon = (isOpen: boolean, rowId: string) => {
        return (
            <div>
                {isOpen ? (
                    <FontAwesomeIcon
                        size="sm"
                        icon={faChevronDown}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(rowId);
                        }}
                    />
                ) : (
                    <FontAwesomeIcon
                        size="sm"
                        icon={faChevronRight}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(rowId);
                        }}
                    />
                )}
            </div>
        );
    };

    const renderHistory = () => {
        if (showSummary || historyData?.length === 0) {
            return (
                <Card>
                    <CardBody>No data to show</CardBody>
                </Card>
            );
        }
        let revertNodeCount = 0;
        return (
            <Card>
                <CardBody>
                    <CardTitle className="mb-4 title-color ">{t('Upgrade History')}</CardTitle>
                    {historyData.length > 0
                        ? historyData.map((el: UpgradeHistoryInterface, index: number) => {
                              const applicableNodes = JSON.parse(el.applicableNodes);
                              const date = new Date(el.startTime * 1000);
                              const dateWithTime = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
                              const isRowOpen = openRows[el.id];
                              if (!upgradeSuccessfull && el.action === INIT_REVERT && el.status === JOB_COMPLETION_STATUS) {
                                  // calculate revert node count until success full upgrade job does not comes.
                                  revertNodeCount += applicableNodes.length;
                              }
                              if (el.action === INIT_UPGRADE && el.status === JOB_COMPLETION_STATUS && !upgradeSuccessfull) {
                                  // if the upgrade job is successfull and if it's the firsth job then add revert option
                                  let offLineNodeCount = 0;
                                  nodeInfo.forEach((nodeInf: NodeInterface) => {
                                      applicableNodes.forEach((element: UpgradeNodeInterface) => {
                                          if (nodeInf.name === element.nodeName && nodeInf.status === OFFLINE) {
                                              offLineNodeCount += 1;
                                          }
                                      });
                                  });
                                  upgradeSuccessfull = true;
                                  if (applicableNodes.length - revertNodeCount > offLineNodeCount) {
                                      el.showRevertBtn = true;
                                  }
                              }
                              return (
                                  <>
                                      <Row style={{ fontSize: '14px' }} className="history-row shadow-lg rounded justify-content-center align-items-center" onClick={() => toggleRow(el.id)}>
                                          <Col sm={1} className="d-flex justify-content-center">
                                              {el.status !== JOB_FAILED ? <FontAwesomeIcon size="1x" icon={faCheckCircle} className={'text-success'} /> : <FontAwesomeIcon size="1x" icon={faCircleXmark} className="text-danger" />}
                                          </Col>
                                          <Col sm={3} className="">
                                              {dateWithTime}
                                          </Col>
                                          <Col sm={2} className="d-flex ">{`${applicableNodes[0].currentVersion} ${applicableNodes[0].appliedVersion ? `→ ${applicableNodes[0].appliedVersion}` : ''}`}</Col>
                                          <Col sm={2} className="d-flex ">{`${applicableNodes.length} Nodes`}</Col>
                                          <Col sm={2} className="d-flex ">
                                              {el.action === INIT_REVERT && el.status === JOB_COMPLETION_STATUS ? t('revert.successful') : el.action === INIT_REVERT && el.status === JOB_FAILED ? t('revert.failed') : el.action === INIT_UPGRADE && el.status === JOB_FAILED ? t('upgrade.failed') : el.action === INIT_UPGRADE && el.status === JOB_COMPLETION_STATUS ? t('upgrade.success') : '-'}
                                          </Col>

                                          <Col sm={1}>
                                              {hasRequestedPrivileges(user, ['upgrade.start']) && el.showRevertBtn ? (
                                                  <a href="#" onClick={(e) => onRevertClick(e, el)}>
                                                      {t('Revert')}
                                                  </a>
                                              ) : null}
                                          </Col>
                                          <Col sm={1}>{renderIcon(isRowOpen, el.id)}</Col>
                                          {openRows[el.id] ? <UpgradeDetails {...props} data={el} user={user} /> : null}
                                      </Row>
                                  </>
                              );
                          })
                        : null}
                </CardBody>
            </Card>
        );
    };

    return <div>{renderHistory()}</div>;
};

export default withTranslation()(UpgradeHistory);
