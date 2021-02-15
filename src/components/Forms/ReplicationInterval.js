import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import DMFieldSelect from '../Shared/DMFieldSelect';
import { FIELDS } from '../../constants/FieldsConstant';

class RepllicationInterval extends Component {
  render() {
    const { dispatch, user } = this.props;
    return (
      <>
        <Row>
          <Col sm={4}>
            Replication Interval
          </Col>
          <Col sm={8}>
            <Row>
              <Col sm={6} className="padding-right-0">
                <DMFieldSelect hideLabel="true" dispatch={dispatch} user={user} fieldKey="drplan.replicationInterval" field={FIELDS['drplan.replicationInterval']} />
              </Col>
              <Col sm={6} className="padding-left-0">
                <DMFieldSelect hideLabel="true" dispatch={dispatch} user={user} fieldKey="ui.values.replication.interval.type" field={FIELDS['ui.values.replication.interval.type']} />
              </Col>
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}

export default RepllicationInterval;
