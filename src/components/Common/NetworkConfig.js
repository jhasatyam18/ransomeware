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

  changeNetworkType(e) {
    const { dispatch, networkKey } = this.props;
    if (e.target.checked) {
      dispatch(valueChange(networkKey, 'public'));
    } else {
      dispatch(valueChange(networkKey, ''));
    }
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
              <input type="checkbox" className="form-check-input" id="vms-options" checked={isPublic} onChange={this.changeNetworkType} />
              Public (Auto)
            </Label>
          </div>
          <div className="form-check-inline">
            <Label className="form-check-label" for="disks-options">
              <input type="checkbox" disabled className="form-check-input" id="disks-options" checked="true" />
              Manual
            </Label>
          </div>
        </Form>
      </div>
    );
  }
}

export default NetworkConfig;
