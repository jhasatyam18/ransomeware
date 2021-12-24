import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Container, Form } from 'reactstrap';
import DMFieldRadio from '../Shared/DMFieldRadio';
import DMFieldText from '../Shared/DMFieldText';
import DMFieldCheckbox from '../Shared/DMFieldCheckbox';
import DMFieldSelect from '../Shared/DMFieldSelect';
import DMMultiSelect from '../Shared/DMMultiSelect';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import { FIELD_TYPE, MULTISELECT_ITEM_COMP } from '../../constants/FieldsConstant';
import { closeModal } from '../../store/actions/ModalActions';
import { onAwsPublicIPChecked } from '../../store/actions';
import { getAWSElasticIPOptions, getGCPExternalIPOptions, getGCPNetworkTierOptions, getSecurityGroupOption, getSubnetOptions, getValue } from '../../utils/InputUtils';
import { isEmpty, validateNicConfig, validateOptionalIPAddress } from '../../utils/validationUtils';

/**
 * Component for network adapter config
 */
class ModalNicConfig extends Component {
  constructor() {
    super();
    this.onSave = this.onSave.bind(this);
  }

  onSave() {
    const { dispatch, user, options } = this.props;
    const result = validateNicConfig(dispatch, user, options);
    if (result) {
      dispatch(closeModal());
    }
  }

  renderAWSConfig() {
    const { dispatch, user, options } = this.props;
    const { values } = user;
    const { networkKey, index } = options;
    const showPublicChk = index === 0;
    const subnetField = { label: 'Subnet', description: '', type: FIELD_TYPE.SELECT, options: (u) => getSubnetOptions(u), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select subnet', shouldShow: true, fieldInfo: 'info.protectionplan.network.aws.subnet' };
    const chkField = { label: 'Auto Public IP', description: '', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, fieldInfo: 'info.protectionplan.network.aws.public', onChange: (v, f) => onAwsPublicIPChecked(v, f) };
    const privateIPField = { label: 'Private IP', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.TEXT, shouldShow: true, validate: (v, u) => validateOptionalIPAddress(v, u), errorMessage: 'Invalid ip address or ip is not in subnet cidr range', fieldInfo: 'info.protectionplan.network.aws.privateip' };
    const securityGroup = { label: 'Security  Groups', placeHolderText: 'Security group', description: '', type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (v, u) => isEmpty(v, u), errorMessage: 'Select security group', COMPONENT: MULTISELECT_ITEM_COMP, options: (u) => getSecurityGroupOption(u), fieldInfo: 'info.protectionplan.network.aws.security.group' };
    const network = { fieldInfo: 'info.protectionplan.network.aws.elasticip', label: 'Elastic IP for instance', placeHolderText: 'Elastic IP', description: '', type: FIELD_TYPE.SELECT, shouldShow: true, errorMessage: 'Select external', options: (u, f) => getAWSElasticIPOptions(u, f), validate: (v, u) => isEmpty(v, u) };
    const isPublic = getValue(`${networkKey}-isPublic`, values);
    return (
      <>
        <Container>
          <Card>
            <CardBody>
              <Form>
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-subnet`} field={subnetField} user={user} />
                {showPublicChk ? (
                  <DMFieldCheckbox dispatch={dispatch} fieldKey={`${networkKey}-isPublic`} field={chkField} user={user} />
                )
                  : null}
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-network`} field={network} user={user} disabled={isPublic} />
                <DMFieldText dispatch={dispatch} fieldKey={`${networkKey}-privateIP`} field={privateIPField} user={user} />
                <DMMultiSelect dispatch={dispatch} fieldKey={`${networkKey}-securityGroups`} field={securityGroup} user={user} />
              </Form>
            </CardBody>
          </Card>
          <div className="modal-footer">
            <button type="button" className="btn btn-success" onClick={this.onSave}>Save</button>
          </div>
        </Container>
      </>
    );
  }

  renderGCPConfig() {
    const { dispatch, user, options } = this.props;
    const { networkKey } = options;
    const subnetField = { fieldInfo: 'info.protectionplan.network.gcp.subnet', label: 'Subnet', description: '', type: FIELD_TYPE.SELECT, options: (u) => getSubnetOptions(u), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select subnet', shouldShow: true };
    const privateIPField = { fieldInfo: 'info.protectionplan.network.gcp.privateip', label: 'Private IP', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.TEXT, shouldShow: true, validate: (v, u) => validateOptionalIPAddress(v, u), errorMessage: 'Invalid ip address or ip is not in subnet cidr range' };
    const publicIP = { fieldInfo: 'info.protectionplan.network.gcp.externalip', label: 'External IP', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.SELECT, shouldShow: true, errorMessage: 'Select external', options: (u) => getGCPExternalIPOptions(u), validate: (v, u) => isEmpty(v, u) };
    const networkTier = { fieldInfo: 'info.protectionplan.network.gcp.tier', label: 'Network Tier', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.RADIO, shouldShow: true, errorMessage: 'Select network tire', options: (u) => getGCPNetworkTierOptions(u), defaultValue: 'Standard' };

    return (
      <>
        <Container>
          <Card>
            <CardBody>
              <Form>
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-subnet`} field={subnetField} user={user} />
                <DMFieldText dispatch={dispatch} fieldKey={`${networkKey}-privateIP`} field={privateIPField} user={user} />
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-publicIP`} field={publicIP} user={user} />
                <DMFieldRadio dispatch={dispatch} fieldKey={`${networkKey}-networkTier`} field={networkTier} user={user} />
              </Form>
            </CardBody>
          </Card>
          <div className="modal-footer">
            <button type="button" className="btn btn-success" onClick={this.onSave}>Save</button>
          </div>
        </Container>
      </>
    );
  }

  render() {
    const { user } = this.props;
    const { values } = user;
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    switch (recoveryPlatform) {
      case PLATFORM_TYPES.GCP:
        return this.renderGCPConfig();
      default:
        return this.renderAWSConfig();
    }
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ModalNicConfig));
