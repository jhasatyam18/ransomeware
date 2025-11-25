import React from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import { MODAL_TEMPLATE_ERROR } from '../../../constants/Modalconstant';
import { openModal } from '../../../store/actions/ModalActions';

function FixPlaybookErrors({ dispatch, playbook, t }) {
  const onErrorClick = () => {
    const options = { title: 'Issues Identified', size: 'lg', playbook };
    dispatch(openModal(MODAL_TEMPLATE_ERROR, options));
  };

  const howToFix = () => (
    <>
      <div>
        <span className="success margin-top-20 margin-left-5">
          {t('title.playbook.how.fix.title')}
        </span>
        <ul type="1">
          <li>
            <div className="how_to_fix_container">
              <div className="stepName">
                {`${t('title.playbook.step')}-1`}
              </div>
              <a href="#" onClick={onErrorClick}>
                {t('click.here')}
              </a>
              {t('view.errors')}
            </div>
          </li>
          <li>
            <div className="how_to_fix_container">
              <div className="stepName">
                {`${t('title.playbook.step')}-2`}
              </div>
              {t('title.correct.issues')}
            </div>
          </li>
          <li>
            <div className="how_to_fix_container">
              <div className="stepName">
                {`${t('title.playbook.step')}-3`}
              </div>
              {t('title.upload.rectified.playbook')}
            </div>
          </li>
        </ul>
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
