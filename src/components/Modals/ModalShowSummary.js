import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { closeModal } from '../../store/actions/ModalActions';
import { isEmpty, isEmptyNum } from '../../utils/validationUtils';

/**
 * Modal Component to show summary details
 * Props specification
 *      - options
 *          - data: [ {title: 'Section Header', values: [ {title: 'titleKey', value: 'titleValue' }] } ]
 *      - reduxAction: Redux action to invoke
 *      - reduxArgs: required arguments to invoke redux action.
 */
function ModalShowSummary(props) {
  const { t, dispatch, options } = props;
  const { data, showSummary } = options;

  const onClose = () => {
    dispatch(closeModal());
  };

  const onApply = () => {
    const { reduxAction, reduxArgs } = options;
    dispatch(reduxAction({ ...reduxArgs }));
  };

  const getChildClass = (cssClass) => {
    const pdUnit = parseInt(cssClass.split('-')[2], 10) + 5;
    return `padding-left-${pdUnit}`;
  };

  const renderKeyValue = (field, cssClass) => {
    const { title, value } = field;
    if (value !== '&nbsp;' && isEmpty({ value }) || isEmptyNum({ value })) {
      return null;
    }
    let val = value;
    if (typeof value === 'boolean') {
      val = (value ? t('label.yes') : t('label.no'));
    }
    if (value === '&nbsp;') {
      val = '';
    }
    return (
      <Row className="summary__view margin-left-0 margin-right-0" key={title}>
        <Col sm={4} className={val === '' ? 'key' : 'key text-muted'}>
          <div className={cssClass}>
            {t(title)}
          </div>
        </Col>
        <Col sm={8} className="value text-muted">
          {val}
        </Col>
      </Row>
    );
  };

  const renderChildKeys = (section, cssClass) => section.values.map((field) => {
    const { values } = field;
    if (values && Array.isArray(values)) {
      const { title } = field;
      return (
        <div key={`summary-section-${title}`}>
          {renderKeyValue({ title, value: '&nbsp;' }, `${cssClass}`)}
          {renderChildKeys(field, getChildClass(cssClass))}
        </div>
      );
    }
    return renderKeyValue(field, cssClass);
  });

  const renderSection = (section, css) => {
    const { title, values } = section;
    const cssClass = (typeof css !== 'undefined' ? css : 'padding-left-10');
    const childCss = getChildClass(cssClass);
    if (typeof values === 'string') {
      return renderKeyValue({ title, value: '' });
    }
    return (
      <div key={`summary-section-${title}`}>
        <Card className="summary_card">
          <div className="summary_card__title">
            {t(title)}
          </div>
          <CardBody>
            {renderChildKeys(section, childCss)}
          </CardBody>
        </Card>
      </div>
    );
  };

  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>Close </button>
      {!showSummary ? <button type="button" className="btn btn-success" onClick={onApply}>Apply</button> : null}
    </div>
  );

  const renderNote = () => {
    const { targetNames, note } = options;
    if (targetNames && targetNames.length > 0 && note) {
      return (
        <div>
          {note}
          <br />
          <div className="text-success">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {targetNames.join(',')}
          </div>
          <br />
        </div>
      );
    }
  };

  const renderData = () => data.map((sec) => (
    renderSection(sec)
  ));

  const render = () => (
    <>
      <div className="modal-body noPadding">
        <SimpleBar className="max-h-400">
          <div className="summary-container">
            {renderNote()}
            <Row>
              <Col sm={12}>
                {renderData()}
              </Col>
            </Row>
          </div>

        </SimpleBar>

      </div>
      {renderFooter()}
    </>
  );
  return render();
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ModalShowSummary));
