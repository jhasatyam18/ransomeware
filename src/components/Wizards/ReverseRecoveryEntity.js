import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardTitle, Col, Container, Label, Row } from 'reactstrap';
import { valueChange } from '../../store/actions';
import DMToolTip from '../Shared/DMToolTip';
import { getValue } from '../../utils/InputUtils';
import { REVERSE_ENTITY_TYPE, STATIC_KEYS } from '../../constants/InputConstants';

function ReverseRecoveryEntity(props) {
  const { t, dispatch, user } = props;
  const { values } = user;
  const [reverseEntityType, setReverseEntityType] = useState(REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL);

  useEffect(() => {
    const revEntityType = getValue(STATIC_KEYS.UI_REVERSE_RECOVERY_ENTITY, values);
    if (revEntityType !== '') {
      setReverseEntityType(revEntityType);
    } else {
      setReverseEntityType(REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL);
      dispatch(valueChange(STATIC_KEYS.UI_REVERSE_RECOVERY_ENTITY, REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL));
    }
  }, []);

  const onRecoveryEntityChange = (value) => {
    const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
    setReverseEntityType(value);
    dispatch(valueChange(STATIC_KEYS.UI_REVERSE_RECOVERY_ENTITY, value));
    Object.keys(vms).forEach((key) => {
      dispatch(valueChange(`${key}-vmConfig.general.entityType`, value));
    });
  };

  const RenderMessage = () => (
    <Row>
      <Col sm={4} />
      <Col sm={8} className="text-muted">
        {reverseEntityType === REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL ? (
          <div className="mt-2">
            <p className="font-weight-bold">{t('maintain.original')}</p>
            <ul>
              <li>{t('maintain.original.statement.one')}</li>
              <li>{t('maintain.original.statement.two')}</li>
              <li>{t('maintain.original.example.statement.one')}</li>
            </ul>
            <p className="text-warning font-weight-bold">{t('warning')}</p>
            <ul className="text-warning">
              <li>{t('maintain.original.warning.one')}</li>
              <li>{t('maintain.original.warning.three')}</li>
            </ul>
          </div>
        ) : (
          <div className="mt-2">
            <p className="font-weight-bold">{t('create.new.copy')}</p>
            <ul>
              <li>{t('create.new.copy.statement.one')}</li>
              <li>{t('create.new.copy.statement.two')}</li>
              <li>{t('create.new.copy.statement.three')}</li>
              <li>{t('create.new.copy.example.one')}</li>
            </ul>
            <p className="text-warning font-weight-bold">{t('warning')}</p>
            <ul className="text-warning">
              <li>{t('create.new.warning.one')}</li>
            </ul>
          </div>
        )}
      </Col>
    </Row>
  );

  const RenderOptions = () => (
    <Card className="padding-20">
      <CardTitle>{t('Reverse Protection Plan')}</CardTitle>
      <CardBody>
        <Row className="mb-4">
          <Col sm={4}>{t('Recovery Entity Type')}</Col>
          <Col sm={7}>
            <div className="form-check-inline pr-4">
              <input type="radio" id="original" className="form-check-input" name="entityType" value={REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL} checked={reverseEntityType === REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL} onChange={(e) => onRecoveryEntityChange(e.target.value)} />
              <Label className="form-check-label" htmlFor="original">{t('Maintain Original')}</Label>
            </div>
            <div className="form-check-inline">
              <input type="radio" id="new" className="form-check-input" name="entityType" value={REVERSE_ENTITY_TYPE.CREATE_NEW_COPY} checked={reverseEntityType === REVERSE_ENTITY_TYPE.CREATE_NEW_COPY} onChange={(e) => onRecoveryEntityChange(e.target.value)} />
              <Label className="form-check-label fs-30" htmlFor="new">{t('Create New Copy')}</Label>
            </div>
          </Col>
          <Col sm={1} className="pl-4"><DMToolTip tooltip={t('entity.type.info')} /></Col>
        </Row>
        {RenderMessage()}
      </CardBody>
    </Card>
  );

  return (
    <Container fluid className="padding-10">
      {RenderOptions()}
    </Container>
  );
}

export default (withTranslation()(ReverseRecoveryEntity));
