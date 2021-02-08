import React, { Component } from 'react';
import { Form, Label } from 'reactstrap';
import DMFieldText from '../Shared/DMFieldText';
import { FIELD_TYPE } from '../../constants/FieldsConstant';
import { IP_REGEX } from '../../constants/ValidationConstants';
import { valueChange } from '../../store/actions';
import { getValue } from '../../utils/InputUtils';

class NetworkConfig extends Component {
  constructor() {
    super();
    this.changeNetworkType = this.changeNetworkType.bind(this);
  }

  componentDidMount() {
    const { user, networkKey, dispatch } = this.props;
    const { values } = user;
    const val = getValue(networkKey, values);
    if (!val) {
      dispatch(valueChange(networkKey, 'public'));
    }
  }

  changeNetworkType(type) {
    const { dispatch, networkKey } = this.props;
    dispatch(valueChange(networkKey, type));
  }

  renderIPField() {
    const { networkKey, user, dispatch } = this.props;
    const { values } = user;
    const isPublic = (getValue(networkKey, values) === 'public');
    const manualIp = { label: 'Ip Address', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid ip address', shouldShow: !isPublic };
    if (!isPublic) {
      return (
        <div>
          <DMFieldText dispatch={dispatch} user={user} field={manualIp} fieldKey={`${networkKey}-manual-ip`} />
        </div>
      );
    }
    return null;
  }

  render() {
    const { networkKey, user } = this.props;
    const { values } = user;
    const isPublic = (getValue(networkKey, values) === 'public');
    return (
      <div>
        <Form className="padding-left-10">
          <div className="form-check-inline">
            <Label className="form-check-label" for="vms-options">
              <input type="radio" className="form-check-input" id="vms-options" name="jobsType" value={isPublic} checked={isPublic} onChange={() => { this.changeNetworkType('public'); }} />
              Auto
            </Label>
          </div>
          <div className="form-check-inline">
            <Label className="form-check-label" for="disks-options">
              <input type="radio" className="form-check-input" id="disks-options" name="jobsType" value={!isPublic} checked={!isPublic} onChange={() => { this.changeNetworkType('private'); }} />
              Manual
            </Label>
          </div>
          {this.renderIPField()}
        </Form>
      </div>
    );
  }
}

export default NetworkConfig;
