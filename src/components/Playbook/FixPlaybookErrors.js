import React from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import { MODAL_TEMPLATE_ERROR } from '../../constants/Modalconstant';
import { openModal } from '../../store/actions/ModalActions';

function FixPlaybookErrors({ dispatch, playbook, t }) {
  const onErrorClick = () => {
    const options = { title: 'Issues Identified', size: 'lg', playbook };
    dispatch(openModal(MODAL_TEMPLATE_ERROR, options));
  };

  const howToFix = () => (
    <>
      <div>
        <span className="success margin-top-20 margin-left-5">How To Fix</span>
        <ol type="1">
          <li>
            <a href="#" onClick={onErrorClick}>
              {t('click.here')}
            </a>
            {t('view.errors')}
          </li>
        </ol>
      </div>
    </>
  );
  return (
    <>
      <Row>
        <Col sm={10} style={{ fontSize: '10px' }}>
          <span className="error">{t('view.identified.error')}</span>
          {howToFix()}
        </Col>
      </Row>
    </>
  );
}

export default (withTranslation()(FixPlaybookErrors));
