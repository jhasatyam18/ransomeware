import React from 'react';
import { Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import DMFieldSelect from '../Shared/DMFieldSelect';
import DMFieldNumber from '../Shared/DMFieldNumber';
import { FIELDS } from '../../constants/FieldsConstant';

function Memory(props) {
  const { dispatch, user, fieldKey, t } = props;
  const numField = FIELDS['drplan.memory.value'];
  const unitField = FIELDS['drplan.memory.unit'];
  return (
    <>
      <Col sm={12}>
        <Row>
          <Col sm={4}>
            <DMFieldNumber hideLabel dispatch={dispatch} user={user} field={numField} fieldKey={`${fieldKey}-memory`} />
          </Col>
          <Col sm={8}>
            <Row>
              <Col sm={12}>
                <Row>
                  <Col sm={8}>
                    <Row>
                      <Col sm={4}>
                        <p className="instance_memory_p">
                          {t('title.unit')}
                        </p>
                      </Col>
                      <Col sm={8}>
                        <DMFieldSelect hideLabel dispatch={dispatch} fieldKey={`${fieldKey}-unit`} user={user} field={unitField} />
                      </Col>

                    </Row>
                  </Col>
                </Row>
              </Col>

            </Row>
          </Col>
        </Row>
      </Col>
    </>
  );
}

export default (withTranslation()(Memory));
