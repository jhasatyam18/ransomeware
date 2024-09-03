import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Badge, Card, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { isEmpty, isEmptyNum } from '../../utils/validationUtils';

function ShowPlaybookVmChanges(props) {
  const { t, data, type, add, deletedData } = props;
  let { id } = props;
  const [isOpen, setIsopen] = useState(!deletedData);
  const changesVMSObj = data;
  const toggle = () => {
    setIsopen(!isOpen);
  };
  if (deletedData && typeof data === 'object') {
    id = data.instanceName;
  }
  const getChildClass = (cssClass) => {
    const pdUnit = parseInt(cssClass.split('-')[2], 10) + 5;
    return `padding-left-${pdUnit}`;
  };

  const renderIcon = () => (
    <div className="wizard-header-options">
      <div className="wizard-header-div">
        {isOpen ? <FontAwesomeIcon size="sm" icon={faChevronDown} onClick={toggle} />
          : <FontAwesomeIcon size="sm" icon={faChevronRight} onClick={toggle} />}
      </div>
    </div>
  );

  const renderKeyValue = (field, cssClass) => {
    const { title, value } = field;
    if (value !== '&nbsp;' && isEmpty({ value }) || isEmptyNum({ value })) {
      return null;
    }
    if (typeof value === 'string') {
      return (
        <Row className="bulk_summary__view margin-left-0 margin-right-0" key={title}>
          <Col sm={4} className={value === '' ? 'key' : 'key text-muted  bulk_diff_border'}>
            <div className={cssClass}>
              {t(title)}
            </div>
          </Col>
          <Col sm={8} className="value text-muted  bulk_diff_border">
            {value}
          </Col>
        </Row>
      );
    }
    let val = value[0];
    let val1 = value[1];
    if (typeof val === 'boolean') {
      val = (val ? t('label.yes') : t('label.no'));
    }
    if (typeof val1 === 'boolean') {
      val1 = (val1 ? t('label.yes') : t('label.no'));
    }
    if (!val || val === '') {
      val = t('-');
    }
    if (!val1 || val1 === '') {
      val1 = t('-');
    }
    if (value === '&nbsp;') {
      val = '';
    }
    return (
      <Row className="bulk_summary__view margin-left-0 margin-right-0" key={title}>
        <Col sm={4} className={val === '' ? 'key' : 'key text-muted bulk_diff_border'}>
          <div className={cssClass}>
            {t(title)}
          </div>
        </Col>
        <Col sm={value.length > 1 ? 4 : 8} className="value text-muted bulk_diff_border">
          {val}
        </Col>
        {value.length > 1 ? (
          <Col sm={4} className="value text-muted bulk_diff_border">
            {val1}
          </Col>
        ) : null}
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
    const { title, values, addData, deleteData } = section;
    const cssClass = (typeof css !== 'undefined' ? css : 'padding-left-10');
    const childCss = getChildClass(cssClass);
    if (typeof values === 'string') {
      return renderKeyValue({ title, value: '' });
    }
    return (
      <div key={`summary-section-${title}`}>
        <Card>
          <Row>
            <Col sm={6} className="margin-bottom-10 ">
              <span className="margin-right-20">{t(title)}</span>
              {addData ? (
                <Badge id={`status-${id}-added`} className="font-size-13 badge-soft-success" color="success" pill>{t('added')}</Badge>

              ) : null}
              {deleteData ? (

                <Badge id={`status-${id}-added`} className="font-size-13 badge-soft-danger" color="danger" pill>{t('deleted')}</Badge>

              ) : null}
            </Col>

          </Row>
          {renderChildKeys(section, childCss)}
        </Card>
      </div>
    );
  };

  const renderData = () => changesVMSObj.map((sec) => (
    renderSection(sec)));

  if (typeof type !== 'undefined' && type === 'protection') {
    return (
      <Row>
        <Col sm={12}>
          {renderData()}
        </Col>
      </Row>
    );
  }

  return (
    <div key="dm-accordion-title">
      <Card className="margin-5">
        <CardHeader style={{ backgroundColor: '#2a3042', border: '1px solid #464952' }}>
          <Row>
            <Col sm={(add || deletedData) ? 6 : 11}>
              <span aria-hidden className="link_color" onClick={toggle}>
                {id}
              </span>
            </Col>

            {add ? (
              <Col sm={5} className="d-flex flex-row-reverse">
                <Badge id={`status-${id}-added`} className="font-size-13 badge-soft-success pt-2" color="success" pill>{t('added')}</Badge>
              </Col>
            ) : null}
            {deletedData ? (
              <Col sm={6} className="d-flex flex-row-reverse">
                <Badge id={`status-${id}-added`} className="font-size-13 badge-soft-danger pt-2" color="danger" pill>{t('deleted')}</Badge>
              </Col>
            ) : null}
            {!deletedData ? (
              <Col sm={1} className="d-flex flex-row-reverse">
                {renderIcon()}
              </Col>
            ) : null}
          </Row>
          {!deletedData ? (
            <Collapse isOpen={isOpen}>
              <Row>
                <Col sm={12}>
                  {renderData()}
                </Col>
              </Row>
            </Collapse>
          ) : null}
        </CardHeader>
      </Card>
    </div>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps)(withTranslation()(ShowPlaybookVmChanges));
