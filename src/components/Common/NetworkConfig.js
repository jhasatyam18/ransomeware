import React, { Component } from 'react';
import { Form } from 'reactstrap';
import AwsNetworkConfig from './AwsNetworkConfig';
import GCPNetworkConfig from './GCPNetworkConfig';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import { getValue } from '../../utils/InputUtils';

class NetworkConfig extends Component {
  render() {
    const { user } = this.props;
    const { values } = user;
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    switch (recoveryPlatform) {
      case PLATFORM_TYPES.AWS:
        return (
          <div>
            <Form className="padding-left-10">
              <AwsNetworkConfig {...this.props} />
            </Form>
          </div>
        );
      default:
        return (
          <GCPNetworkConfig {...this.props} />
        );
    }
  }
}

export default NetworkConfig;
