import React from 'react';
import { Row, Col } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { validateMemoryValue, isEmpty } from '../../utils/validationUtils';
import { diableVMwareMemory } from '../../utils/InputUtils';
import DMFieldSelect from '../Shared/DMFieldSelect';
import DMFieldNumber from '../Shared/DMFieldNumber';

function Memory(props) {
  const { dispatch, user, fieldKey, t } = props;
  const numField = { label: '', errorMessage: 'required', shouldShow: true, validate: ({ value }) => validateMemoryValue({ value, user, fieldKey }), min: 1, max: 4000, disabled: () => diableVMwareMemory(user, fieldKey) };
  const unitField = { label: 'Unit', errorMessage: 'unit', options: [{ label: 'MB', value: 'MB' }, { label: 'GB', value: 'GB' }, { label: 'TB', value: 'TB' }], shouldShow: true, validate: (value) => isEmpty(value, user) };

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
