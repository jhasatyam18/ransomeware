import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Form, Row, Badge, Input } from 'reactstrap';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import DMField from '../../Shared/DMField';
import RoleMapper from '../../Common/RoleMapper';
import ActionButton from '../../Common/ActionButton';
// actions
import { deleteIDPConfiguration, fetchRegisteredIDP, saveIDPConfiguration, setRoleData, uploadMetadataFile } from '../../../store/actions/IdpActions';
import { refreshApplication, valueChange } from '../../../store/actions';
// utils
import { getDatamotiveRoles, getValue } from '../../../utils/InputUtils';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
// constants
import { MODAL_CONFIRMATION_WARNING } from '../../../constants/Modalconstant';
import { openModal } from '../../../store/actions/ModalActions';
import { FIELDS } from '../../../constants/FieldsConstant';
import { API_SAML_METADATA } from '../../../constants/ApiConstants';
import DMToolTip from '../../Shared/DMToolTip';

function IdentityProvider(props) {
  const { t, user, dispatch, settings } = props;
  const { license = {} } = user;
  const { nodeKey = '' } = license;
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { idp } = settings;
  const entityID = `https://${window.location.host}/${nodeKey}`;
  const metaData = `https://${window.location.host}/${API_SAML_METADATA}`;
  const refresh = useSelector((state) => state.user.context.refresh);
  let isUnmounted = false;

  function renderTooltip(fieldInfo) {
    return (
      <DMToolTip tooltip={fieldInfo} />
    );
  }

  useEffect(() => {
    setShowForm(false);
    dispatch(fetchRegisteredIDP());
    dispatch(setRoleData());
    return () => {
      isUnmounted = true;
      return isUnmounted;
    };
  }, [refresh]);

  const onIDPSave = () => {
    dispatch(saveIDPConfiguration());
  };

  const onDelete = () => {
    const options = { title: t('title.alert'), confirmAction: deleteIDPConfiguration, message: t('info.remove.idp.config') };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onCancel = () => {
    dispatch(refreshApplication());
  };

  const onFormEdit = () => {
    setShowForm(true);
  };

  const onFileChange = (e) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    // setFile(e.target.files[0]);
    setName(e.target.files[0].name);
    dispatch(uploadMetadataFile(e.target.files[0], e.target.files[0].name));
    dispatch(valueChange('configureIDP.metadataFile', e.target.files[0].name));
  };

  const configureIDP = () => {
    setShowForm(true);
  };

  function renderMetadata() {
    return (
      <div className="idp-container">
        <Row>
          <Col sm={8}>
            <div className="text-muted padding-bottom-5">
              <b>{t('dm.saml.configuration')}</b>
            </div>
            <Form>
              <Row>
                <Col sm={4} className="padding-bottom-5 padding-left-15">
                  {t('title.entityID')}
                </Col>
                <Col sm={7}>
                  {entityID}
                </Col>
                <Col sm={1}>
                  {renderTooltip('info.saml.entity.id')}
                </Col>
                <Col sm={4} className="padding-left-15">
                  {t('title.metadataurl')}
                </Col>
                <Col sm={7}>
                  <a href={metaData} target="_blank" rel="noreferrer">{t('saml.2.0.metadata')}</a>
                </Col>
                <Col sm={1}>
                  {renderTooltip('info.saml.metadata')}
                </Col>
              </Row>
            </Form>

          </Col>
        </Row>
      </div>

    );
  }

  function renderGeneral() {
    return (
      <div className="col-sm-12">
        <label className="text-info">{t('saml.configuration')}</label>
        <Form className="padding-left-10">
          <DMField dispatch={dispatch} user={user} fieldKey="configureIDP.name" key="configureIDP.name" />
          <DMField dispatch={dispatch} user={user} fieldKey="configureIDP.metadataURL" key="configureIDP.metadataUrl" />
          {/* upload metadata file */}
          <Row>
            <Col sm={4}>
              {t('title.metadata.file')}
            </Col>
            <Col sm={7} className="padding-left-15">
              <label htmlFor="fileUploadSAML" className="label">
                <div className="idp-upload"><i className="fa fa-upload" size="lg" /></div>
              </label>
              <Input type="file" id="fileUploadSAML" name="fileUploadSAML" style={{ visibility: 'none', display: 'none' }} onSelect={onFileChange} onChange={onFileChange} />
              <p>{name === '' ? null : name}</p>
            </Col>
            <Col sm={1}>
              {renderTooltip('info.idp.metadatafile')}
            </Col>
          </Row>
          {/* upload metadata file */}
          <Row>
            <label className="text-info">{t('saml.attr.claims')}</label>
          </Row>
          <DMField dispatch={dispatch} user={user} fieldKey="configureIDP.attributes.email" key="configureIDP.attributes.email" />
          <DMField dispatch={dispatch} user={user} fieldKey="configureIDP.attributes.name" key="configureIDP.attributes.name" />
          <DMField dispatch={dispatch} user={user} fieldKey="configureIDP.attributes.role" key="configureIDP.attributes.role" />
        </Form>
      </div>
    );
  }

  function renderRoleMapping() {
    const f = FIELDS['configureIDP.roleMaps'];
    return (
      <>
        <div className="col-sm-12">
          <label className="text-info">{t('title.role.mapping')}</label>
          <Form className="padding-left-10">
            <RoleMapper options={getDatamotiveRoles} dispatch={dispatch} user={user} fieldKey="configureIDP.roleMaps" key="configureIDP.roleMaps" field={f} />
          </Form>
        </div>
      </>
    );
  }

  function getActionButtons(actions) {
    return (
      <div className="btn-toolbar">
        <div className="btn-group" role="group" aria-label="First group">
          {actions.map((item) => {
            const { label, onClick, icon, isDisabled, cssName } = item;
            return (
              <ActionButton label={label} onClick={onClick} icon={icon} isDisabled={isDisabled} t={t} key={`${label}-${icon}`} cssName={cssName} />
            );
          })}
        </div>
      </div>
    );
  }

  function renderGlobalActions() {
    const actionIcon = idp.id !== 0 ? 'fa fa-edit' : 'fa fa-plus';
    const actions = [
      { label: t('title.configure'), onClick: onIDPSave, icon: actionIcon, isDisabled: (!hasRequestedPrivileges(user, ['identityprovider.create'])), cssName: 'btn btn-success btm-sm margin-right-2' },
      { label: 'title.cancel', onClick: onCancel, icon: 'fa fa-cancel' }];
    return (
      <>
        {getActionButtons(actions)}
      </>
    );
  }

  function renderMapping() {
    const { values } = user;
    const roleMap = getValue('configureIDP.roleMaps', values);
    if (!roleMap || roleMap.length === 0) {
      return (
        <div className="text-muted padding-bottom-5">
          <b>{t('title.no.role.mapping')}</b>
        </div>
      );
    }
    return roleMap.map((role, index) => (
      <Row>
        <Col sm={8}>
          <div className="row margin-left-10 padding-bottom-10 col" key={`role-${index * 1}`}>
            <Badge className="font-size-13 badge-soft-info" color="info" pill>
              {role.key}
              -
              {role.value}
              &nbsp;&nbsp;
            </Badge>
          </div>
        </Col>
      </Row>
    ));
  }

  function showSummary() {
    if (typeof idp === 'undefined' || typeof idp.attributes === 'undefined') {
      return (
        <div className="text-muted padding-bottom-5">
          <b>{t('saml.identity.provider')}</b>
          <br />
          <br />
          <a href="#" onClick={configureIDP}>{t('saml.identity.provider.configure')}</a>
        </div>
      );
    }
    const summaryFields = [
      { label: 'saml.configuration', value: '', isParent: true },
      { label: 'title.name', value: idp.name || '' },
      { label: 'title.metadataurl', value: idp.metadataURL || '-' },
      { label: 'title.metadata.file', value: idp.metadataFile || '-' },
      { label: 'saml.attr.claims', value: '', isParent: true },
      { label: 'title.email', value: idp.attributes.email || '-' },
      { label: 'title.name', value: idp.attributes.name || '-' },
      { label: 'title.role', value: idp.attributes.role || '-' },
      { label: 'title.role.mapping', isParent: true },
    ];
    return (
      <Row>
        <br />
        <br />
        <Col sm={12}>
          <ActionButton label={t('edit')} onClick={onFormEdit} icon="fa fa-edit" isDisabled={!hasRequestedPrivileges(user, ['identityprovider.create'])} t={t} />
          <ActionButton label={t('title.remove')} onClick={onDelete} icon="fa fa-trash" isDisabled={!hasRequestedPrivileges(user, ['identityprovider.create'])} t={t} />
          <br />
          <br />
        </Col>
        {summaryFields.map((field) => (
          <>
            <Col sm={3} className={field.isParent ? 'text-info' : 'padding-right-5'}>
              {t(field.label)}
            </Col>
            <Col sm={9} className="text-muted">
              {field.value}
              <br />
              <br />
            </Col>
          </>
        ))}
        <Col sm={12}>
          {renderMapping()}
        </Col>
      </Row>
    );
  }

  function renderForm() {
    if (!showForm) {
      return (
        <div className="idp-container">
          {showSummary()}
        </div>
      );
    }
    return (
      <div className="idp-container">
        <Row>
          <Col sm={8}>
            <Form>
              {renderGeneral()}
              {renderRoleMapping()}
            </Form>
          </Col>
        </Row>
        <Col sm={12} className="padding-bottom-10">
          {renderGlobalActions()}
        </Col>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardBody>
          <DMBreadCrumb links={[{ label: 'title.identityProvider', link: '#' }]} />
          <br />
          <Row>
            <Col sm={12}>
              {renderMetadata()}
              {renderForm()}
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}
function mapStateToProps(state) {
  const { user, settings } = state;
  return { user, settings };
}
export default connect(mapStateToProps)(withTranslation()(IdentityProvider));
