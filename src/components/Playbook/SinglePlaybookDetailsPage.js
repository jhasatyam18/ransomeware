import React, { useEffect, useRef } from 'react';
import { Container, Card, CardBody, Row, Col, Input } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { faDownload, faEdit, faFileCircleCheck, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect, useSelector } from 'react-redux';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import { playbookExport } from '../../store/actions/DrPlanActions';
import { NOTE_TEXT } from '../../constants/DMNoteConstant';
import DMNote from '../Common/DMNote';
import { MILI_SECONDS_TIME } from '../../constants/EventConstant';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { callAPI } from '../../utils/ApiUtils';
import { API_GET_CONFIG_TEMPLATE_BY_ID } from '../../constants/ApiConstants';
import { clearValues, hideApplicationLoader, showApplicationLoader, valueChange } from '../../store/actions';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { closeModal, openModal } from '../../store/actions/ModalActions';
import { PLAYBOOKS_STATUS, TEMPLATE_STATUS } from '../../constants/AppStatus';
import { PLAYBOOK_DETAILS, PLAYBOOK_CHANGES_RENDERER } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';
import { deletePlaybook, onCreatePlanFromPlaybook, setSinglePlaybook, uploadFiles, validatePlaybook } from '../../store/actions/DrPlaybooksActions';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import { PLAYBOOK_LIST, PROTECTION_PLANS_PATH } from '../../constants/RouterConstants';
import SinglePlaybookStatusRenderer from './SinglePlaybookStatusRenderer';
import FixPlaybookErrors from './FixPlaybookErrors';

function SinglePlaybookDetailsPage(props) {
  const { dispatch, drPlaybooks, user, t } = props;
  const { playbook } = drPlaybooks;
  const { status, name } = playbook;
  const location = useLocation();
  const timerId = useRef();

  const ref = useSelector((state) => state.user.context.refresh);

  useEffect(() => {
    const parts = location.pathname.split('/');
    fetchPlaybookById(parts[parts.length - 1], true);
    timerId.current = undefined;
    return () => {
      clearInterval(timerId.current);
    };
  }, [ref]);

  function fetchPlaybookById(id, show) {
    const bulkConfigByIdURL = API_GET_CONFIG_TEMPLATE_BY_ID.replace('<id>', id);
    if (show) {
      dispatch(showApplicationLoader('Fetching', 'Loading Playbook details..'));
    }
    return callAPI(bulkConfigByIdURL)
      .then((json) => {
        dispatch(hideApplicationLoader('Fetching'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(valueChange(STATIC_KEYS.UI_TEMPLATE_BY_ID, json));
          dispatch(setSinglePlaybook(json));
          if (json.status === 'configValidating' && typeof timerId.current === 'undefined') {
            timerId.current = getTimerTofetch(id);
          } else if (json.status !== 'configValidating') {
            clearInterval(timerId.current);
          }
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('Fetching'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  }

  function getTimerTofetch(id) {
    return setInterval(() => {
      try {
        fetchPlaybookById(id);
      } catch (e) {
        dispatch(addMessage(e, MESSAGE_TYPES.ERROR));
        clearInterval(timerId.current);
      }
    }, MILI_SECONDS_TIME.FIVE_THOUSAND);
  }

  if (!drPlaybooks.playbook) {
    return null;
  }

  if (Object.keys(playbook).length === 0) {
    return null;
  }

  const { planConfigurations, id } = playbook;

  if (planConfigurations.length === 0) {
    return null;
  }

  const fileName = playbook.name;

  const renderButtons = (item) => {
    const { label, isDisabled, onClick, url, icon, component } = item;
    if (typeof component !== 'undefined') {
      return component();
    }
    if (url) {
      <a href={url} key={`bulk_button_${label}-${id}`} className="btn btn-sm margin-right-2 btn-secondary" disabled={isDisabled}>
        {icon ? (
          <>
            <FontAwesomeIcon size="md" className="margin-right-5" icon={icon} />
            {t(`${label}`)}
          </>
        ) : t(`${label}`)}
      </a>;
    }
    return (
      <button type="button" key={`bulk_button_${label}-${id}`} onClick={onClick} className="btn  btn-sm margin-right-2 btn-secondary" disabled={isDisabled}>
        {icon ? (
          <>
            <FontAwesomeIcon size="md" className="margin-right-5" icon={icon} />
            {t(`${label}`)}
          </>
        ) : t(`${label}`)}
      </button>
    );
  };

  const getActionButtons = (actions) => (
    <div className="btn-toolbar margin-top-20 margin-left-20">
      <div className="btn-group" role="group" aria-label="First group">
        {actions.map((item) => renderButtons(item))}
      </div>
    </div>
  );

  const onValidate = () => {
    const options = { title: 'Validate Playbook', confirmAction: validatePlaybook, message: `Are you sure want to validate ${playbook.name} ?`, id, footerLabel: 'Validate', color: 'success', size: 'lg' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onClose = () => {
    dispatch(closeModal());
    dispatch(clearValues());
  };

  const onCreatePplanClick = () => {
    dispatch(onCreatePlanFromPlaybook(id));
  };

  const createPlanFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>Close </button>
      <button type="button" className="btn btn-success" onClick={onCreatePplanClick}>
        { planConfigurations[0]?.planID > 0 ? t('title.edit.pplan') : t('confirm')}
      </button>
    </div>
  );

  const onCreatePplan = () => {
    const options = { title: t('confirm.playbook.plan.config'), footerComponent: createPlanFooter, confirmAction: onCreatePlanFromPlaybook, message: `Are you sure want to configure protection plan from ${playbook.name} playbook ?`, id, footerLabel: 'Create Protection Plan', color: 'success', size: 'lg' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onRemove = () => {
    const options = { title: t('confirm.confirmation'), confirmAction: deletePlaybook, message: `Are you sure want to remove ${name} playbook ?`, id, size: 'lg' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onFileChange = (e) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const url = API_GET_CONFIG_TEMPLATE_BY_ID.replace('<id>', id);
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    dispatch(uploadFiles(e.target.files[0], url, 'Configuring Excel file to download', '', 'PUT'));
  };

  const onExport = () => {
    dispatch(playbookExport(planConfigurations[0], planConfigurations[0].planID));
  };

  const renderWarningWhileEdit = () => (
    <>
      <i className="fas fa-exclamation-triangle" />
          &nbsp;&nbsp;&nbsp;
      <span>
        {t('edit.playbook.warn.msg', { name })}
      </span>
      <p className="margin-top-5">
        {<small aria-hidden className="link_color" onClick={onExport}>[click here]</small>}
        { t('title.download.configured.excel')}
      </p>
    </>
  );
  const renderedit = () => (
    <>
      <div className="card_note_warning margin-top-5 text-left">
        {planConfigurations.length > 0 && planConfigurations[0]?.planID > 0
          ? (
            <>
              <DMNote component={renderWarningWhileEdit} title="Note" color={NOTE_TEXT.WARNING} open />

            </>
          )
          : null}
        <span className="text-muted margin-left-20">
          {t('title.upload.playbook')}
        </span>
        <label htmlFor={`reuploadFile-${name}`} className="margin-left-10 link_color">
          <FontAwesomeIcon size="md" icon={faUpload} />
        </label>
        <Input type="file" accept="xlsx/*" id={`reuploadFile-${name}`} name={`reuploadFile-${name}`} className="modal-lic-upload" onSelect={onFileChange} onChange={onFileChange} />

      </div>
    </>
  );

  const renderEditFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t('close')}
        {' '}
      </button>
    </div>
  );

  const onEdit = () => {
    const options = { title: 'Edit Playbook', footerComponent: renderEditFooter, component: renderedit, color: 'success', footerLabel: 'Reupload Excel', size: `${planConfigurations[0]?.planID > 0 ? 'lg' : ''}` };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onDownloadClick = () => {
    if (typeof name !== 'undefined') {
      const downloadURL = `${window.location.protocol}//${window.location.host}/playbooks/${name}`;
      const link = document.createElement('a');
      link.href = downloadURL;
      link.click();
    }
  };

  const renderGlobalActions = () => {
    const disableValidate = TEMPLATE_STATUS.indexOf(status) === 1;
    const disablePlan = TEMPLATE_STATUS.indexOf(status) === 2;
    const pplanLabel = planConfigurations[0]?.planID > 0 ? t('title.edit.pplan') : t('title.create.pplan');
    const actions = [{ label: t('validate'), onClick: onValidate, isDisabled: !hasRequestedPrivileges(user, ['playbook.validate']) || disableValidate, icon: faFileCircleCheck },
      { label: pplanLabel, onClick: onCreatePplan, isDisabled: !hasRequestedPrivileges(user, ['playbook.configure']) || !disablePlan },
      { label: t('download'), isDisabled: !hasRequestedPrivileges(user, ['playbook.generate']), icon: faDownload, onClick: onDownloadClick },
      { label: t('edit.playbook'), isDisabled: !hasRequestedPrivileges(user, ['playbook.edit']), icon: faEdit, onClick: onEdit },
      { label: t('remove'), onClick: onRemove, icon: faTrash, isDisabled: !hasRequestedPrivileges(user, ['playbook.delete']) },
    ];
    return (
      <>
        {getActionButtons(actions)}
      </>
    );
  };

  let columns = [];
  if (TEMPLATE_STATUS.indexOf(status) === 2 && planConfigurations[0]?.planID > 0) {
    columns = [...PLAYBOOK_DETAILS, { label: 'Changes', field: 'id', itemRenderer: PLAYBOOK_CHANGES_RENDERER }];
  } else {
    columns = [...PLAYBOOK_DETAILS];
  }

  return (
    <Container fluid>
      <Card>
        <CardBody>
          <DMBreadCrumb links={[{ label: 'protection.plans', link: PROTECTION_PLANS_PATH }, { label: 'title.templates', link: PLAYBOOK_LIST }, { label: fileName, link: '#' }]} />
          <Row>
            <Col sm={8}>
              {renderGlobalActions()}
            </Col>
            <Col sm={4}>
              <SinglePlaybookStatusRenderer dispatch={dispatch} playbook={playbook} field="status" showStatusLabel user={user} />
            </Col>
          </Row>
          {status === PLAYBOOKS_STATUS.PLAYBOOK_VALIDATION_FAILED ? (
            <div className="padding-left-20">
              <FixPlaybookErrors dispatch={dispatch} playbook={playbook} />
            </div>
          ) : null}
          <DMTable
            dispatch={dispatch}
            columns={columns}
            data={planConfigurations}
            primaryKey="id"
            selectionInput="rdo"
            user={user}
          />
        </CardBody>
      </Card>
    </Container>
  );
}
function mapStateToProps(state) {
  const { drPlaybooks } = state;
  return { drPlaybooks };
}

export default connect(mapStateToProps)(withTranslation()(SinglePlaybookDetailsPage));
