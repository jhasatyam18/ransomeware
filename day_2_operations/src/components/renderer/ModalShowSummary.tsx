import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { AppDispatch } from '../../store';
import { closeModal } from '../../store/reducers/ModalReducer';
import { isEmpty, isEmptyNum } from '../../utils/ValidationUtils';

// ** Define Interfaces for Props **
interface KeyValue {
    title: string;
    value: string | boolean;
    values?: KeyValue[];
}

interface Section {
    title: string;
    values: KeyValue[] | string;
}

interface ModalShowSummaryProps extends WithTranslation {
    dispatch: AppDispatch;
    modal: Record<string, any>;
}

const ModalShowSummary: React.FC<ModalShowSummaryProps> = ({ t, dispatch, modal }) => {
    const { options } = modal;
    const { data, showSummary } = options;

    const onClose = () => {
        dispatch(closeModal());
    };

    const onApply = () => {
        return;
    };

    const getChildClass = (cssClass: string): string => {
        const pdUnit = parseInt(cssClass.split('-')[2], 10) + 5;
        return `padding-left-${pdUnit}`;
    };

    const renderKeyValue = (field: KeyValue, cssClass: string) => {
        const { title, value } = field;
        if (value !== '&nbsp;' && (isEmpty({ value }) || isEmptyNum({ value }))) {
            return null;
        }

        let val: string | boolean = value;
        if (typeof value === 'boolean') {
            val = value ? t('label.yes') : t('label.no');
        }
        if (value === '&nbsp;') {
            val = '';
        }

        return (
            <Row className="summary__view margin-left-0 margin-right-0" key={title}>
                <Col sm={4} className={val === '' ? 'key' : 'key text-muted'}>
                    <div className={cssClass}>{t(title)}</div>
                </Col>
                <Col sm={8} className="value text-muted">
                    {val}
                </Col>
            </Row>
        );
    };

    const renderChildKeys = (section: Section, cssClass: string) =>
        section.values instanceof Array
            ? section.values.map((field) => {
                  if (field.values && Array.isArray(field.values)) {
                      const { title } = field;
                      return (
                          <div key={`summary-section-${title}`}>
                              {renderKeyValue({ title, value: '&nbsp;' }, `${cssClass}`)}
                              {renderChildKeys({ title, values: field.values }, getChildClass(cssClass))}
                          </div>
                      );
                  }
                  return renderKeyValue(field, cssClass);
              })
            : null;

    const renderSection = (section: Section, css: string = 'padding-left-10') => {
        const { title, values } = section;
        const childCss = getChildClass(css);
        if (typeof values === 'string') {
            return renderKeyValue({ title, value: '' }, css);
        }
        return (
            <div key={`summary-section-${title}`}>
                <Card className="summary_card">
                    <div className="summary_card__title">{t(title)}</div>
                    <CardBody>{renderChildKeys(section, childCss)}</CardBody>
                </Card>
            </div>
        );
    };

    const renderFooter = () => (
        <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} id="showSummary_close_button">
                Close
            </button>
            {!showSummary ? (
                <button type="button" className="btn btn-success" onClick={onApply} id="showSummary_apply_button">
                    Apply
                </button>
            ) : null}
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
                        {targetNames.join(', ')}
                    </div>
                    <br />
                </div>
            );
        }
    };

    const renderData = () => data.map((sec: any) => renderSection(sec));

    return (
        <>
            <div className="modal-body noPadding">
                <SimpleBar className="max-h-400">
                    <div className="summary-container">
                        {renderNote()}
                        <Row>
                            <Col sm={12}>{renderData()}</Col>
                        </Row>
                    </div>
                </SimpleBar>
            </div>
            {renderFooter()}
        </>
    );
};

const mapStateToProps = (state: { user: any }) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(ModalShowSummary));
