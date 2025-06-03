import React from 'react';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withTranslation } from 'react-i18next';
import { Col, Container, Label, Row } from 'reactstrap';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { TABLE_REVERSE_VM } from '../../constants/TableConstants';
import { openModal } from '../../store/actions/ModalActions';
import { getValue } from '../../utils/InputUtils';
import { applyRecommendedDataToAllVM, getWarningVMS } from '../../utils/ReverseReplicationUtils';
import ActionButton from '../Common/ActionButton';
import DMTable from '../Table/DMTable';

function ReverseVMStep(props) {
  const { dispatch, user, t } = props;
  const { values } = user;
  const planData = getValue('ui.reverse.drPlan', values);
  const failedEntitie = getValue(STATIC_KEYS.REVERSE_VALIDATE_FAILED_ENTITIE, values);
  const vms = getWarningVMS(user);
  const hasWarning = !(vms.length > 0);
  let updateVMs = [];
  if (planData !== '') {
    const { protectedEntities } = planData;
    const { VirtualMachines } = protectedEntities;
    updateVMs = VirtualMachines.map((vm) => {
      if (failedEntitie && failedEntitie.length > 0) {
        const failedEntity = failedEntitie.find((entity) => entity.failedEntity === vm.moref);
        if (failedEntity) {
          return {
            ...vm,
            description: failedEntity.failureMessage,
          };
        }
        return {
          ...vm,
        };
      }
      return {
        ...vm,
      };
    });
  }
  const columns = TABLE_REVERSE_VM.filter((col) => col.label !== 'Storage' && col.label !== 'os');
  const onRecommendedData = () => {
    const options = { title: 'Confirmation', confirmAction: applyRecommendedDataToAllVM, message: 'Are you sure you want to apply suggested configuration in all VMs ?' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  return (
    <Container fluid className="padding-10">
      <Row>
        <Col sm={10}>
          <Label className="ml-3 pl-1 h5">{t('Virtual Machine')}</Label>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={10} className="pl-4 ml-2">
          <ActionButton title={t('title.apply.recommended.button')} label={t('label.apply.recommended.button')} t={t} key="applyRecommended" isDisabled={hasWarning} onClick={onRecommendedData} cssClass="apply_suggested_btn" />
        </Col>
        <Col sm={1}>
          <a className="pl-4  ml-3 link_color" href="/reverseGuide.html" target="_blank" rel="noopener noreferrer" title="Learn More">
            <FontAwesomeIcon size="lg" icon={faCircleInfo} />
          </a>
        </Col>
      </Row>
      <DMTable
        dispatch={dispatch}
        columns={columns}
        data={updateVMs}
        primaryKey="moref"
        user={user}
      />
    </Container>
  );
}

export default (withTranslation()(ReverseVMStep));
