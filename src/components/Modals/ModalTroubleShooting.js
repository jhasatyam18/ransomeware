import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
// import classnames from 'classnames';
import { withTranslation } from 'react-i18next';
import { Tbody, Th, Tr } from 'react-super-responsive-table';
import { Card, CardBody, CardHeader, Col, Collapse, Container, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { API_FETCH_DR_PLAN_BY_ID } from '../../constants/ApiConstants';
import { RECOVERY_TYPE } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { closeModal } from '../../store/actions/ModalActions';
import { callAPI } from '../../utils/ApiUtils';
import CopyText from '../Common/CopyText';

function ModalTroubleShooting(props) {
  const { options, t, dispatch } = props;
  const { data } = options;
  const { recoveryType, protectionPlanID } = data;
  const [activeTab] = useState('1');
  const [sourceNodePlanURL, setSourceNodePlanURL] = useState('');
  const [toggle, setToggle] = useState(false);
  const [toggleSystemCheck, setToggleSystemCheck] = useState(false);
  const [toggleWindow, setToggleWindow] = useState(false);
  const [toggleFilesystems, setToggleFilesystems] = useState(false);
  const dismHealth = ['DISM.exe /Online /Cleanup-Image /ScanHealth', 'DISM.exe /Online /Cleanup-Image /CheckHealth'];
  const dismHealthRecovery = ['DISM /Image:D:\\  /Cleanup-Image /ScanHealth', 'DISM /Image:D:\\  /Cleanup-Image /CheckHealth'];
  useEffect(() => {
    let isUnmounting = false;
    // get plan details from api
    callAPI(API_FETCH_DR_PLAN_BY_ID.replace('<id>', protectionPlanID)).then((json) => {
      if (isUnmounting) return;
      const { protectedSite = '', remoteProtectionPlanId = 0 } = json;
      const { node = {} } = protectedSite;
      const { hostname = '' } = node;
      setSourceNodePlanURL(`https://${hostname}:${node.managementPort}/protection/plan/details/${remoteProtectionPlanId}?reset=true`);
    },
    (err) => {
      if (isUnmounting) return;
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
    return () => {
      isUnmounting = true;
    };
  }, []);

  const renderTabLinks = () => (
    <NavItem>
      <NavLink className="cursor-pointer troubleShoot_nav_heading">
        <i className="fab fa-windows">
          &nbsp;&nbsp;&nbsp;&nbsp;
          {t('Windows')}
        </i>
      </NavLink>
    </NavItem>
  );

  const toggleCollapse = () => {
    setToggle((prev) => !prev);
  };

  const close = () => {
    dispatch(closeModal());
  };

  const renderTestRecoveryHelp = () => (
    <Card>
      <CardBody>
        <Nav tabs className="nav-tabs-custom nav-justified">
          {renderTabLinks()}
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1" className="p-3">
            <div className="troubleshoot_container">
              <div className="troubleshoot_title text-muted mb-2">
                {t('title.troubleshoot.win.description')}
              </div>

              <div className="troubleshoot_title ml-1">
                {t('symptoms')}
              </div>
              <div className="troubleshoot_description text-muted">
                <p>{t('title.troubleshoot.symptoms.w1')}</p>
                <Table className="table text-muted">
                  <Tbody>
                    <Tr>
                      <Th className="w-25">{t('symptoms')}</Th>
                      <Th>{t('description')}</Th>
                    </Tr>
                    <Tr>
                      <Th>
                        {t('machine.boots.up.repair.mode')}
                      </Th>
                      <Th>{t('title.troubleshoot.symptoms.w1-1')}</Th>
                    </Tr>
                    <Tr>
                      <Th>
                        {t('machine.boots.up.with.black.screen')}
                      </Th>
                      <Th>{t('title.troubleshoot.symptoms.w1-2')}</Th>
                    </Tr>
                    <Tr>
                      <Th>
                        {t('machine.is.not.powered.on')}
                      </Th>
                      <Th>{t('title.troubleshoot.symptoms.w1-3')}</Th>
                    </Tr>
                  </Tbody>
                </Table>
              </div>
              <div className="troubleshoot_title">
                {t('title.troubleshoot.fix.steps')}
              </div>
              <div className="troubleshoot_description text-muted mb-3">
                {t('title.troubleshoot.fix.steps-d')}
                <br />
                {t('title.troubleshoot.fix.steps-d-env')}
                <CardHeader className="mt-4 mb-2">
                  <Row>
                    <Col sm={6}>
                      <a href="#" onClick={() => setToggleSystemCheck(((prev) => !prev))}>
                        {t('system.status.check')}
                      </a>
                    </Col>
                    <Col sm={6} className="d-flex flex-row-reverse">
                      <box-icon name="chevron-down" color="white" onClick={() => setToggleSystemCheck(((prev) => !prev))} style={{ height: 20 }} />
                    </Col>
                  </Row>
                  <Collapse isOpen={toggleSystemCheck}>
                    <CardBody className="padding-left-0 paddings-right-0">
                      <div className="mb-4">
                        <span>{t('condition.to.execute.statement')}</span>
                        <p className="font-italic font-weight-bold">{t('system.status.check.excute.conditions')}</p>
                      </div>
                      <Table className="table text-muted">
                        <Tbody>
                          <Tr>
                            <Th>{t('steps')}</Th>
                            <Th>{t('action')}</Th>
                            <Th>{t('description')}</Th>
                          </Tr>
                          <Tr>
                            <Th>{t('disk.consistency.check')}</Th>
                            <Th className="copy_text_th"><CopyText text="sfc /scannow" /></Th>
                            <Th>{t('disk.consistency.check-desc-output')}</Th>
                          </Tr>
                          <Tr>
                            <Th className="w-25">{t('window.consistency.check')}</Th>
                            <Th><CopyText text={dismHealth} /></Th>
                            <Th>
                              {t('window.consistency.check-desc')}
                            </Th>
                          </Tr>
                          <Tr>
                            <Th className="w-25">{t('window.consistancy.issue-d')}</Th>
                            <Th><CopyText text="Dism /Online /Cleanup-Image /RestoreHealth" /></Th>
                            <Th>
                              {t('command.report.issue')}
                              <br />
                              {t('command.report.issue-solution')}
                              <br />
                              {t('window.consistancy.issue-e')}
                            </Th>
                          </Tr>
                        </Tbody>
                      </Table>
                    </CardBody>
                  </Collapse>
                </CardHeader>
                <CardHeader className="mb-2">
                  <Row>
                    <Col sm={6}>
                      <a href="#" onClick={() => setToggleWindow(((prev) => !prev))}>
                        {t('windows.updates.status.check')}
                      </a>
                    </Col>
                    <Col sm={6} className="d-flex flex-row-reverse">
                      <box-icon name="chevron-down" color="white" onClick={() => setToggleWindow(((prev) => !prev))} style={{ height: 20 }} />
                    </Col>
                  </Row>
                  <Collapse isOpen={toggleWindow}>
                    <CardBody className="padding-left-0 paddings-right-0">
                      <div className="mb-4">
                        <span>{t('condition.to.execute.statement')}</span>
                        <p className="font-italic font-weight-bold">{t('window.update.status.check.excute.conditions')}</p>
                      </div>
                      <Table className="table text-muted">
                        <Tbody>
                          <Tr>
                            <Th>{t('steps')}</Th>
                            <Th>{t('action')}</Th>
                            <Th>{t('description')}</Th>
                          </Tr>
                          <Tr>
                            <Th>{t('verify.reboot.pending.status')}</Th>
                            <Th>
                              {t('verify.reboot.pending.status.desc-update')}
                              <ol>
                                <li>{t('verify.reboot.pending.status-desc-a')}</li>
                                <li>{t('verify.reboot.pending.status-desc-b')}</li>
                                <li>{t('verify.reboot.pending.status-desc-c')}</li>
                              </ol>
                            </Th>
                            <Th>
                              {t('verify.reboot.pending.status-desc')}
                            </Th>
                          </Tr>
                          <Tr>
                            <Th className="w-25">{t('analyze.component.store')}</Th>
                            <Th><CopyText text="DISM.exe /Online /Cleanup-Image /AnalyzeComponentStore" /></Th>
                            <Th>{t('analyze.component.store-desc')}</Th>
                          </Tr>
                          <Tr>
                            <Th className="w-25">{t('analyze.component.store-desc-c')}</Th>
                            <Th><CopyText text="DISM.exe /Online /Cleanup-Image /StartComponentCleanup" /></Th>
                            <Th>{t('analyze.component.store-desc-b')}</Th>
                          </Tr>
                        </Tbody>
                      </Table>
                    </CardBody>
                  </Collapse>
                </CardHeader>
                <CardHeader className="mb-2">
                  <Row>
                    <Col sm={6}>
                      <a href="#" onClick={() => setToggleFilesystems(((prev) => !prev))}>
                        {t('filesystems.status.check')}
                      </a>
                    </Col>
                    <Col sm={6} className="d-flex flex-row-reverse">
                      <box-icon name="chevron-down" color="white" onClick={() => setToggleFilesystems(((prev) => !prev))} style={{ height: 20 }} />
                    </Col>
                  </Row>
                  <Collapse isOpen={toggleFilesystems}>
                    <CardBody className="padding-left-0 paddings-right-0">
                      <div className="mb-4">
                        <span>{t('condition.to.execute.statement')}</span>
                        <p className="font-italic font-weight-bold">{t('filesystem.status.check.excute.conditions')}</p>
                      </div>
                      <Table className="table text-muted">
                        <Tbody>
                          <Tr>
                            <Th>{t('steps')}</Th>
                            <Th className="copy_text_th">{t('action')}</Th>
                            <Th>{t('description')}</Th>
                          </Tr>
                          <Tr>
                            <Th>{t('verify.disk.consistency')}</Th>
                            <Th className="w-25"><CopyText text="fsutil dirty query C:" /></Th>
                            <Th>
                              {t('verify.disk.consistency-desc')}
                            </Th>
                          </Tr>
                          <Tr>
                            <Th className="w-25">{t('verify.disk.consistency-2')}</Th>
                            <Th><CopyText text="chkdsk /r C:" /></Th>
                            <Th>{t('verify.disk.consistency-desc-b')}</Th>
                          </Tr>
                        </Tbody>
                      </Table>
                    </CardBody>
                  </Collapse>
                </CardHeader>
              </div>
              <div className="text-muted mb-3">{t('window.consistency.check-desc-b')}</div>
              <div className="troubleshoot_title">
                {t('validation')}
                :
              </div>
              <div className="text-muted">
                <ul>
                  <li>{t('validation.point-a')}</li>
                  <li>
                    {t('validation.point-b')}
                    <a href={sourceNodePlanURL} key="t_sourceSite_link" target="_blank" rel="noopener noreferrer">
                      Click here.
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </TabPane>
        </TabContent>
      </CardBody>
    </Card>
  );

  const renderFullRecoveryHelp = () => (
    <Card>
      <CardBody>
        <Nav tabs className="nav-tabs-custom nav-justified">
          {renderTabLinks()}
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1" className="p-3">
            <div className="troubleshoot_container">
              <div className="troubleshoot_title text-muted">
                {t('title.troubleshoot.win.description')}
              </div>

              <div className="troubleshoot_title ml-1 mb-1">
                {t('symptoms')}
              </div>
              <div className="troubleshoot_description text-muted">
                {t('title.troubleshoot.symptoms.recovery.w1')}
                <br />
                <br />
                <Table className="table text-muted">
                  <Tbody>
                    <Tr>
                      <Th className="w-25">{t('symptoms')}</Th>
                      <Th>{t('description')}</Th>
                    </Tr>
                    <Tr>
                      <Th>
                        {t('machine.boots.up.repair.mode')}
                      </Th>
                      <Th>{t('title.troubleshoot.symptoms.w1-1')}</Th>
                    </Tr>
                    <Tr>
                      <Th>
                        {t('machine.boots.up.with.black.screen')}
                      </Th>
                      <Th>{t('title.troubleshoot.symptoms.w1-2')}</Th>
                    </Tr>
                    <Tr>
                      <Th>
                        {t('machine.is.not.powered.on')}
                      </Th>
                      <Th>{t('title.troubleshoot.symptoms.w1-3')}</Th>
                    </Tr>
                  </Tbody>
                </Table>
              </div>
              <div className="troubleshoot_title">
                {t('title.troubleshoot.fix.steps')}
              </div>
              <div className="troubleshoot_description text-muted">
                {t('title.troubleshoot.fix.steps.recovery-d')}
                <br />
                <br />
                {t('title.troubleshoot.fix.workflow.steps')}
                <ul>
                  <div className="troubleshoot_title mt-2">
                    {t('title.troubleshoot.fix.workflow.steps-1')}
                    <br />
                  </div>
                  <div>{t('prepare.disk.troubleshooting-desc')}</div>
                  <CardHeader className="mt-4 mb-2">
                    <Row>
                      <Col sm={6}>
                        <a href="#" onClick={toggleCollapse}>
                          {t('title.troubleshoot.fix.workflow.steps.a')}
                        </a>
                      </Col>
                      <Col sm={6} className="d-flex flex-row-reverse">
                        <box-icon name="chevron-down" color="white" onClick={() => setToggle(((prev) => !prev))} style={{ height: 20 }} />
                      </Col>
                    </Row>
                    <Collapse isOpen={toggle}>
                      <CardBody className="padding-left-0 paddings-right-0">
                        <Table className="table text-muted">
                          <Tbody>
                            <Tr>
                              <Th>{t('steps')}</Th>
                              <Th>{t('description')}</Th>
                            </Tr>
                            <Tr>
                              <Th>{t('power-on-prep-node')}</Th>
                              <Th>
                                <ul>
                                  <li>{t('opretion.failed.steps')}</li>
                                  <ul>
                                    <li>{t('opretion.failed.steps-1-aws')}</li>
                                    <li>{t('opretion.failed.steps-1-azure')}</li>
                                    <li>{t('opretion.failed.steps-1-vmware')}</li>
                                    <li>{t('opretion.failed.steps-3')}</li>
                                  </ul>
                                  <li>
                                    {t('opretion.failed.steps.with.syptoms')}
                                  </li>
                                  <ul>
                                    <li>{t('opretion.failed.steps.with.syptoms-1')}</li>
                                    <ul>
                                      <li>
                                        {t('aws')}
                                        :
                                      </li>
                                      <ul>
                                        <li>{t('Recovery.operation.failed.aws-1')}</li>
                                        <li>{t('Recovery.operation.failed.aws-2')}</li>
                                      </ul>
                                    </ul>
                                    <ul>
                                      <li>
                                        {t('azure')}
                                        :
                                      </li>
                                      <ul>
                                        <li>{t('Recovery.operation.failed.azure-1')}</li>
                                        <li>{t('Recovery.operation.failed.azure-2')}</li>
                                      </ul>
                                    </ul>
                                    <ul>
                                      <li>
                                        {t('vmware')}
                                        :
                                      </li>
                                      <ul>
                                        <li>{t('Recovery.operation.failed.vmware-1')}</li>
                                        <li>{t('Recovery.operation.failed.vmware-2')}</li>
                                      </ul>
                                    </ul>
                                    <li>{t('opretion.failed.steps.with.syptoms-2')}</li>
                                  </ul>
                                </ul>
                              </Th>
                            </Tr>
                            <Tr>
                              <Th>{t('rdp.into.prep.node')}</Th>
                              <Th>
                                {t('rdp.into.prep.node.cred-desc')}
                                <br />
                                <span className="text-warning">{t('rdp.into.prep.node.credentials')}</span>
                              </Th>
                            </Tr>
                            <Tr>
                              <Th>{t('after.rdp.node')}</Th>
                              <Th>
                                <ul>
                                  <li>{t('after.rdp.node.step-1')}</li>
                                  <li>{t('after.rdp.node.step-2')}</li>
                                </ul>
                              </Th>
                            </Tr>
                          </Tbody>
                        </Table>
                      </CardBody>
                    </Collapse>
                  </CardHeader>
                  <div className="troubleshoot_title mt-3">
                    {t('title.troubleshoot.fix.workflow.steps-2')}
                  </div>
                  <div className="troubleshoot_description text-muted mb-2">{t('recovery.validation-2-details')}</div>
                  <CardHeader className="mb-2">
                    <Row>
                      <Col sm={6}>
                        <a href="#" onClick={() => setToggleSystemCheck(((prev) => !prev))}>
                          {t('system.status.check')}
                        </a>
                      </Col>
                      <Col sm={6} className="d-flex flex-row-reverse">
                        <FontAwesomeIcon size="sm" icon={faChevronDown} onClick={() => setToggleSystemCheck(((prev) => !prev))} className="padding-4" />
                      </Col>
                    </Row>
                    <Collapse isOpen={toggleSystemCheck}>
                      <CardBody className="padding-left-0 paddings-right-0">
                        <div className="mb-4">
                          <span>{t('condition.to.execute.statement')}</span>
                          <p className="font-italic font-weight-bold">{t('system.status.check.excute.conditions')}</p>
                        </div>
                        <Table className="table text-muted">
                          <Tbody>
                            <Tr>
                              <Th>{t('steps')}</Th>
                              <Th className="copy_text_th">{t('action')}</Th>
                              <Th>{t('description')}</Th>
                            </Tr>
                            <Tr>
                              <Th>{t('disk.consistency.check')}</Th>
                              <Th><CopyText text="SFC /SCANNOW /OFFBOOTDIR=D:\ /OFFWINDIR=D:\Windows" /></Th>
                              <Th>
                                {t('disk.consistency.check-desc')}
                                <br />
                                {t('disk.consistency.check-desc-output')}
                              </Th>
                            </Tr>
                            <Tr>
                              <Th className="w-25">{t('window.consistency.check')}</Th>
                              <Th><CopyText text={dismHealthRecovery} /></Th>
                              <Th>
                                {t('window.consistency.check-desc')}
                              </Th>
                            </Tr>
                            <Tr>
                              <Th className="w-25">{t('window.consistancy.issue-d')}</Th>
                              <Th><CopyText text="DISM /Image:D:\  /Cleanup-Image /RestoreHealth" /></Th>
                              <Th>
                                {t('command.report.issue')}
                                <br />
                                {t('window.consistancy.issue-e')}
                              </Th>
                            </Tr>
                          </Tbody>
                        </Table>
                      </CardBody>
                    </Collapse>
                  </CardHeader>
                  <CardHeader className="mb-2">
                    <Row>
                      <Col sm={6}>
                        <a href="#" onClick={() => setToggleWindow(((prev) => !prev))}>
                          {t('windows.updates.status.check')}
                        </a>
                      </Col>
                      <Col sm={6} className="d-flex flex-row-reverse">
                        <FontAwesomeIcon size="sm" icon={faChevronDown} onClick={() => setToggleWindow(((prev) => !prev))} className="padding-4" />
                      </Col>
                    </Row>
                    <Collapse isOpen={toggleWindow}>
                      <CardBody className="padding-left-0 paddings-right-0">
                        <div className="mb-4">
                          <span>{t('condition.to.execute.statement')}</span>
                          <p className="font-italic font-weight-bold">{t('window.update.status.check.excute.conditions')}</p>
                        </div>
                        <Table className="table text-muted">
                          <Tbody>
                            <Tr>
                              <Th>{t('steps')}</Th>
                              <Th>{t('action')}</Th>
                              <Th>{t('description')}</Th>
                            </Tr>
                            <Tr>
                              <Th className="w-25">{t('verify.reboot.pending.status')}</Th>
                              <Th>
                                <ol>
                                  <li>{t('varify.reboot.pending.status-1')}</li>
                                  <li>{t('varify.reboot.pending.status-2')}</li>
                                  <li>{t('varify.reboot.pending.status-3')}</li>
                                  <li>{t('varify.reboot.pending.status-4')}</li>
                                </ol>
                              </Th>
                              <Th className="w-30">-</Th>
                            </Tr>
                            <Tr>
                              <Th className="w-25">{t('confirm.package.pending')}</Th>
                              <Th><CopyText text="DISM /Image:D: /Get-packages" /></Th>
                              <Th>
                                {t('confirm.package.pending-desc')}
                                <br />
                                <br />
                                {t('confirm.package.pending-procced')}
                              </Th>
                            </Tr>
                            <Tr>
                              <Th className="w-25">{t('confirm.package.pending-procced-1')}</Th>
                              <Th><CopyText text="Dism /Image:D:\ /Cleanup-Image /RevertPendingActions" /></Th>
                              <Th>
                                <ul>
                                  <li>{t('confirm.package.pending-procced-step-1')}</li>
                                  <li>{t('confirm.package.pending-procced-step-2')}</li>
                                  <li>{t('confirm.package.pending-procced-step-3')}</li>
                                  <li>{t('confirm.package.pending-procced-step-4')}</li>
                                </ul>
                              </Th>
                            </Tr>
                            <Tr>
                              <Th className="w-25">{t('analyze.component.store')}</Th>
                              <Th><CopyText text="DISM.exe /Image:D:\  /Cleanup-Image /AnalyzeComponentStore" /></Th>
                              <Th>
                                {t('analyze.component.store-desc')}
                                <br />
                                <br />
                                {t('analyze.component.store-desc-b')}
                              </Th>
                            </Tr>
                            <Tr>
                              <Th className="w-25">{t('analyze.component.store-desc-c')}</Th>
                              <Th><CopyText text="DISM.exe /Image:D:\  /Cleanup-Image /StartComponentCleanup" /></Th>
                              <Th>
                                {t('analyze.component.store-desc')}
                                <br />
                                <br />
                                {t('analyze.component.store-desc-b')}
                              </Th>
                            </Tr>
                          </Tbody>
                        </Table>
                      </CardBody>
                    </Collapse>
                  </CardHeader>
                  <CardHeader className="mb-2">
                    <Row>
                      <Col sm={6}>
                        <a href="#" onClick={() => setToggleFilesystems(((prev) => !prev))}>
                          {t('filesystems.status.check')}
                        </a>
                      </Col>
                      <Col sm={6} className="d-flex flex-row-reverse">
                        <FontAwesomeIcon size="sm" icon={faChevronDown} onClick={() => setToggleFilesystems(((prev) => !prev))} className="padding-4" />
                      </Col>
                    </Row>
                    <Collapse isOpen={toggleFilesystems}>
                      <CardBody className="padding-left-0 paddings-right-0">
                        <div className="mb-4">
                          <span>{t('condition.to.execute.statement')}</span>
                          <p className="font-italic font-weight-bold">{t('filesystem.status.check.excute.conditions')}</p>
                        </div>
                        <Table className="table text-muted">
                          <Tbody>
                            <Tr>
                              <Th>{t('steps')}</Th>
                              <Th className="copy_text_th">{t('action')}</Th>
                              <Th>{t('description')}</Th>
                            </Tr>
                            <Tr>
                              <Th>{t('verify.disk.consistency')}</Th>
                              <Th className="w-25"><CopyText text="fsutil dirty query D:" /></Th>
                              <Th>
                                {t('verify.disk.consistency-desc-d')}
                              </Th>
                            </Tr>
                            <Tr>
                              <Th className="w-25">{t('verify.disk.consistency-2')}</Th>
                              <Th><CopyText text="chkdsk /r D:" /></Th>
                              <Th>
                                {t('to.correct.state.filesystem-desc')}
                              </Th>
                            </Tr>
                          </Tbody>
                        </Table>
                      </CardBody>
                    </Collapse>
                  </CardHeader>
                </ul>
              </div>
              <div className="troubleshoot_title">
                {t('validation')}
                :
              </div>
              <div className="text-muted">
                <ul>
                  <li>{t('recovery.validation-1')}</li>
                  <li>{t('recovery.validation-2')}</li>
                </ul>
              </div>
            </div>
          </TabPane>
        </TabContent>
      </CardBody>
    </Card>
  );

  return (
    <Container className="troubleShoot_container">
      <SimpleBar className="max-h-530">
        {recoveryType === RECOVERY_TYPE.TEST_RECOVERY ? renderTestRecoveryHelp() : renderFullRecoveryHelp()}
      </SimpleBar>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close}>Close </button>
      </div>
    </Container>
  );
}

export default (withTranslation()(ModalTroubleShooting));
