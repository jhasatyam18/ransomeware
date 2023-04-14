import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Container, Form, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { IP_REGEX } from '../../constants/ValidationConstants';
import { onGCPNetworkChange } from '../../store/actions/GcpActions';
import { onAwsPublicIPChecked } from '../../store/actions/AwsActions';
import DMSearchSelect from '../Shared/DMSearchSelect';
import DMFieldCheckbox from '../Shared/DMFieldCheckbox';
import DMFieldRadio from '../Shared/DMFieldRadio';
import DMFieldSelect from '../Shared/DMFieldSelect';
import DMFieldText from '../Shared/DMFieldText';
import DMMultiSelect from '../Shared/DMMultiSelect';
import { FIELD_TYPE, MULTISELECT_ITEM_COMP } from '../../constants/FieldsConstant';
import { PLATFORM_TYPES, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { onAwsCopyNetConfigChange, onAwsSubnetChange, onAwsVPCChange, valueChange } from '../../store/actions';
import { closeModal } from '../../store/actions/ModalActions';
import { getAvailibilityZoneOptions, getAWSElasticIPOptions, getAzureExternalIPOptions, getAzureNetworkOptions, getAzureSecurityGroupOption, getAzureSubnetOptions, getGCPExternalIPOptions, getGCPNetworkTierOptions, getGCPSubnetOptions, getNetworkOptions, getSecurityGroupOption, getSubnetOptions, getValue, getVMwareAdpaterOption, getVPCOptions, getWMwareNetworkOptions, isAWSCopyNic, isPlanWithSamePlatform } from '../../utils/InputUtils';
import { isEmpty, validateNicConfig, validateOptionalIPAddress } from '../../utils/validationUtils';
/**
 * Component for network adapter config
 */
class ModalNicConfig extends Component {
  constructor() {
    super();
    this.state = { oldConfig: {} };
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    this.storeInitialData();
  }

  onSave() {
    const { dispatch, user, options } = this.props;
    const result = validateNicConfig(dispatch, user, options);
    if (result) {
      dispatch(closeModal());
    }
  }

  onCancel() {
    const { dispatch } = this.props;
    this.resetInitialData();
    dispatch(closeModal());
  }

  storeInitialData() {
    const { user, options } = this.props;
    const { values } = user;
    const { networkKey } = options;
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    if (recoveryPlatform === PLATFORM_TYPES.AWS) {
      const subnet = getValue(`${networkKey}-subnet`, values);
      const vpc = getValue(`${networkKey}-vpcId`, values);
      const availZone = getValue(`${networkKey}-availZone`, values);
      const sg = getValue(`${networkKey}-securityGroups`, values) || [];
      const isCopyConfiguration = isAWSCopyNic(`${networkKey}-subnet`, '-subnet', user);
      const pvtIP = getValue(`${networkKey}-privateIP`, values) || '';
      const network = getValue(`${networkKey}-network`, values);
      const networkTier = getValue(`${networkKey}-networkTier`, values);
      this.setState({ oldConfig: { subnet, sg, isCopyConfiguration, pvtIP, network, networkTier, vpc, availZone } });
    }
    if (recoveryPlatform === PLATFORM_TYPES.GCP) {
      const network = getValue(`${networkKey}-network`, values);
      const subnet = getValue(`${networkKey}-subnet`, values);
      const privateIP = getValue(`${networkKey}-privateIP`, values);
      const publicIP = getValue(`${networkKey}-publicIP`, values);
      const networkTier = getValue(`${networkKey}-networkTier`, values);
      this.setState({ oldConfig: { network, subnet, privateIP, publicIP, networkTier } });
    }
    if (recoveryPlatform === PLATFORM_TYPES.VMware) {
      const network = getValue(`${networkKey}-network`, values);
      const adapterType = getValue(`${networkKey}-adapterType`, values);
      const macAddress = getValue(`${networkKey}-macAddress`, values);
      const publicIP = getValue(`${networkKey}-publicIP`, values) || '';
      const netmask = getValue(`${networkKey}-netmask`, values) || '';
      const gateway = getValue(`${networkKey}-gateway`, values) || '';
      const dnsserver = getValue(`${networkKey}-dnsserver`, values) || '';
      this.setState({ oldConfig: { network, adapterType, publicIP, macAddress, netmask, gateway, dnsserver } });
    }
  }

  resetInitialData() {
    const { dispatch, options, user } = this.props;
    const { values } = user;
    const { networkKey } = options;
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    const { oldConfig } = this.state;
    if (recoveryPlatform === PLATFORM_TYPES.AWS) {
      const { subnet, sg, isCopyConfiguration, pvtIP, network, networkTier, vpc, availZone } = oldConfig;
      dispatch(valueChange(`${networkKey}-vpcId`, vpc));
      dispatch(valueChange(`${networkKey}-subnet`, subnet));
      dispatch(valueChange(`${networkKey}-availZone`, availZone));
      dispatch(valueChange(`${networkKey}-securityGroups`, sg));
      dispatch(valueChange(`${networkKey}-isFromSource`, isCopyConfiguration));
      dispatch(valueChange(`${networkKey}-privateIP`, pvtIP));
      dispatch(valueChange(`${networkKey}-network`, network));
      dispatch(valueChange(`${networkKey}-networkTier`, networkTier));
    }
    if (recoveryPlatform === PLATFORM_TYPES.GCP) {
      const { network, subnet, privateIP, publicIP, networkTier } = oldConfig;
      dispatch(valueChange(`${networkKey}-network`, network));
      dispatch(valueChange(`${networkKey}-subnet`, subnet));
      dispatch(valueChange(`${networkKey}-privateIP`, privateIP));
      dispatch(valueChange(`${networkKey}-publicIP`, publicIP));
      dispatch(valueChange(`${networkKey}-networkTier`, networkTier));
    }
    if (recoveryPlatform === PLATFORM_TYPES.VMware) {
      const { network, adapterType, macAddress, publicIP, netmask, gateway, dnsserver } = oldConfig;
      dispatch(valueChange(`${networkKey}-network`, network));
      dispatch(valueChange(`${networkKey}-adapterType`, adapterType));
      dispatch(valueChange(`${networkKey}-macAddress`, macAddress));
      dispatch(valueChange(`${networkKey}-publicIP`, publicIP));
      dispatch(valueChange(`${networkKey}-netmask`, netmask));
      dispatch(valueChange(`${networkKey}-gateway`, gateway));
      dispatch(valueChange(`${networkKey}-dnsserver`, dnsserver));
    }
  }

  renderCopyConfigCheckbox() {
    const { dispatch, user, options } = this.props;
    const { networkKey } = options;
    const isAwsToAws = isPlanWithSamePlatform(user);
    const uiWorkflow = getValue(STATIC_KEYS.UI_WORKFLOW, user.values);
    if (isAwsToAws && uiWorkflow !== UI_WORKFLOW.TEST_RECOVERY) {
      const chkField = { label: 'Create From Source', description: '', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, onChange: (v, f) => onAwsCopyNetConfigChange(v, f), fieldInfo: 'info.aws.create.network.from.source' };
      return (
        <DMFieldCheckbox dispatch={dispatch} fieldKey={`${networkKey}-isFromSource`} field={chkField} user={user} />
      );
    }
    return null;
  }

  renderAWSConfig() {
    const { dispatch, user, options } = this.props;
    const { values } = user;
    const { networkKey, index } = options;
    const showPublicChk = index === 0;
    const vpc = { label: 'VPC', description: '', type: FIELD_TYPE.SELECT, options: (u, f) => getVPCOptions(u, f), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select VPC', shouldShow: true, fieldInfo: 'info.protectionplan.network.aws.vpc', onChange: (u, d) => onAwsVPCChange(u, d) };
    const subnetField = { label: 'Subnet', description: '', type: FIELD_TYPE.SELECT, options: (u, f) => getSubnetOptions(u, f), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select subnet', shouldShow: true, fieldInfo: 'info.protectionplan.network.aws.subnet', onChange: (u, d) => onAwsSubnetChange(u, d) };
    const chkField = { label: 'Auto Public IP', description: '', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, fieldInfo: 'info.protectionplan.network.aws.public', onChange: (v, f) => onAwsPublicIPChecked(v, f) };
    const privateIPField = { label: 'Private IP', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.TEXT, shouldShow: true, validate: (v, u) => validateOptionalIPAddress(v, u), errorMessage: 'Invalid ip address or ip is not in subnet cidr range', fieldInfo: 'info.protectionplan.network.aws.privateip' };
    const securityGroup = { label: 'Security  Groups', placeHolderText: 'Security group', description: '', type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (v, u) => isEmpty(v, u), errorMessage: 'Select security group', COMPONENT: MULTISELECT_ITEM_COMP, options: (u, k) => getSecurityGroupOption(u, k), fieldInfo: 'info.protectionplan.network.aws.security.group' };
    const network = { fieldInfo: 'info.protectionplan.network.aws.elasticip', label: 'Elastic IP for instance', placeHolderText: 'Elastic IP', description: '', type: FIELD_TYPE.SELECT, shouldShow: true, errorMessage: 'Select external', options: (u, f) => getAWSElasticIPOptions(u, f), validate: (v, u) => isEmpty(v, u) };
    const availZone = { fieldInfo: 'info.protectionplan.network.aws.availZone', label: 'Availability Zone', placeHolderText: 'Availability Zone', description: '', type: FIELD_TYPE.SELECT, shouldShow: true, errorMessage: 'Select availability zone', options: (u, f) => getAvailibilityZoneOptions(u, f), validate: (v, u) => isEmpty(v, u) };
    const isPublic = getValue(`${networkKey}-isPublic`, values);
    const isCopyFromSource = getValue(`${networkKey}-isFromSource`, values) || false;
    return (
      <>
        <Container>
          <Card>
            <SimpleBar className="modal_nic_simplbar">
              <CardBody>
                <Form>
                  <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-vpcId`} field={vpc} user={user} />
                  {this.renderCopyConfigCheckbox()}
                  <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-subnet`} field={subnetField} user={user} />
                  <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-availZone`} field={availZone} user={user} disabled={!isCopyFromSource} />
                  {showPublicChk ? (
                    <DMFieldCheckbox dispatch={dispatch} fieldKey={`${networkKey}-isPublic`} field={chkField} user={user} />
                  )
                    : null}
                  <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-network`} field={network} user={user} disabled={isPublic} />
                  <DMFieldText dispatch={dispatch} fieldKey={`${networkKey}-privateIP`} field={privateIPField} user={user} />
                  <DMMultiSelect dispatch={dispatch} fieldKey={`${networkKey}-securityGroups`} field={securityGroup} user={user} />
                </Form>
              </CardBody>
            </SimpleBar>
          </Card>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={this.onCancel}>Cancel</button>
            <button type="button" className="btn btn-success" onClick={this.onSave}>Save</button>
          </div>
        </Container>
      </>
    );
  }

  renderGCPConfig() {
    const { dispatch, user, options } = this.props;
    const { networkKey } = options;
    const networkField = { fieldInfo: 'info.protectionplan.network.gcp.network', label: 'Network', description: '', type: FIELD_TYPE.SELECT, options: (u) => getNetworkOptions(u), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select network', shouldShow: true, onChange: (v, f) => onGCPNetworkChange(v, f) };
    const subnetField = { fieldInfo: 'info.protectionplan.network.gcp.subnet', label: 'Subnet', description: '', type: FIELD_TYPE.SELECT, options: (u, f) => getGCPSubnetOptions(u, f), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select subnet', shouldShow: true };
    const privateIPField = { fieldInfo: 'info.protectionplan.network.gcp.privateip', label: 'Private IP', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.TEXT, shouldShow: true, validate: (v, u) => validateOptionalIPAddress(v, u), errorMessage: 'Invalid ip address or ip is not in subnet cidr range' };
    const publicIP = { fieldInfo: 'info.protectionplan.network.gcp.externalip', label: 'External IP', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.SELECT, shouldShow: true, errorMessage: 'Select external', options: (u) => getGCPExternalIPOptions(u), validate: (v, u) => isEmpty(v, u) };
    const networkTier = { fieldInfo: 'info.protectionplan.network.gcp.tier', label: 'Network Tier', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.RADIO, shouldShow: true, errorMessage: 'Select network tire', options: (u) => getGCPNetworkTierOptions(u), defaultValue: 'Standard' };

    return (
      <>
        <Container>
          <Card>
            <CardBody>
              <Form>
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-network`} field={networkField} user={user} />
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-subnet`} field={subnetField} user={user} />
                <DMFieldText dispatch={dispatch} fieldKey={`${networkKey}-privateIP`} field={privateIPField} user={user} />
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-publicIP`} field={publicIP} user={user} />
                <DMFieldRadio dispatch={dispatch} fieldKey={`${networkKey}-networkTier`} field={networkTier} user={user} />
              </Form>
            </CardBody>
          </Card>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={this.onCancel}>Cancel</button>
            <button type="button" className="btn btn-success" onClick={this.onSave}>Save</button>
          </div>
        </Container>
      </>
    );
  }

  renderVMwareConfig() {
    const { user, dispatch, options, t } = this.props;
    const { values } = user;
    const { networkKey } = options;
    const networkField = { label: '', description: '', type: FIELD_TYPE.SELECT_SEARCH, shouldShow: true, defaultValue: false, options: (u, f) => getWMwareNetworkOptions(u, f), fieldInfo: 'info.vmware.network' };
    const AdapterField = { label: '', description: '', type: FIELD_TYPE.SELECT, options: (u, f) => getVMwareAdpaterOption(u, f), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select Adapter Type', shouldShow: true, fieldInfo: 'info.vmware.adapter.type' };
    const MacAddressField = { label: '', description: '', type: FIELD_TYPE.TEXT, options: (u, f) => getVPCOptions(u, f), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select Mac address', shouldShow: true, fieldInfo: 'info.vmware.mac.address' };
    const staticIP = { fieldInfo: 'info.protectionplan.network.vmware.staticip', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.SELECT, shouldShow: true, errorMessage: 'Configure static IP Address', validate: (v, u) => isEmpty(v, u) };
    const ip = { label: '', description: '', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], validate: (value, u) => isEmpty(value, u), errorMessage: 'Please add IP address', shouldShow: true, fieldInfo: 'info.vmware.ip.addr' };
    const subnet = { label: '', description: '', type: FIELD_TYPE.TEXT, validate: (value, u) => isEmpty(value, u), errorMessage: 'Please add Subnet', shouldShow: true, fieldInfo: 'info.vmware.subnet' };
    const gateway = { label: '', description: '', type: FIELD_TYPE.TEXT, validate: (value, u) => isEmpty(value, u), errorMessage: 'Please add Gateway', shouldShow: true, fieldInfo: 'info.vmware.network.gateway' };
    const dns = { label: '', description: '', type: FIELD_TYPE.TEXT, validate: (value, u) => isEmpty(value, u), errorMessage: 'Please add DNS', shouldShow: true, fieldInfo: 'info.vmware.primary.dns' };
    const staticip = getValue(`${networkKey}-isPublic`, values);
    return (
      <Container>
        <Card className="nic_modal_Width">
          <CardBody>
            <Form>
              <Row>
                <Col sm={4}>
                  {t('title.network.name')}
                </Col>
                <Col sm={8}>
                  <DMSearchSelect hideLabel user={user} dispatch={dispatch} fieldKey={`${networkKey}-network`} field={networkField} />
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  {t('title.adapter.type')}
                </Col>
                <Col sm={8}>
                  <DMFieldSelect hideLabel dispatch={dispatch} fieldKey={`${networkKey}-adapterType`} field={AdapterField} user={user} />
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  {t('title.mac.address')}
                </Col>
                <Col sm={8}>
                  <DMFieldText hideLabel dispatch={dispatch} fieldKey={`${networkKey}-macAddress`} field={MacAddressField} user={user} />
                </Col>
              </Row>
              <Row style={{ marginTop: '10px' }}>
                <Col sm={4}>
                  {t('title.staticip')}
                </Col>
                <Col sm={6}>
                  <DMFieldCheckbox hideLabel dispatch={dispatch} fieldKey={`${networkKey}-isPublic`} field={staticIP} user={user} />
                </Col>
              </Row>
              {staticip ? (
                <>
                  <Row className="margin-top-15">
                    <Col sm={4}>
                      {t('title.ip')}
                    </Col>
                    <Col sm={8}>
                      <DMFieldText hideLabel dispatch={dispatch} fieldKey={`${networkKey}-publicIP`} field={ip} user={user} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      {t('vmware.subnet')}
                    </Col>
                    <Col sm={8}>
                      <DMFieldText hideLabel dispatch={dispatch} fieldKey={`${networkKey}-netmask`} field={subnet} user={user} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      {t('gateway')}
                    </Col>
                    <Col sm={8}>
                      <DMFieldText hideLabel dispatch={dispatch} fieldKey={`${networkKey}-gateway`} field={gateway} user={user} />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      {t('dns')}
                    </Col>
                    <Col sm={8}>
                      <DMFieldText hideLabel dispatch={dispatch} fieldKey={`${networkKey}-dnsserver`} field={dns} user={user} />
                    </Col>
                  </Row>
                </>
              ) : null}
            </Form>
          </CardBody>
        </Card>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={this.onCancel}>Cancel</button>
          <button type="button" className="btn btn-success" onClick={this.onSave}>Save</button>
        </div>
      </Container>
    );
  }

  renderAzureConfig() {
    const { dispatch, user, options, t } = this.props;
    const { networkKey } = options;
    const networkField = { fieldInfo: 'info.protectionplan.network.azure.network', label: 'Virtual Network', description: '', type: FIELD_TYPE.SELECT, options: (u, f) => getAzureNetworkOptions(u, f), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select network', shouldShow: true };
    const subnetField = { fieldInfo: 'info.protectionplan.network.azure.subnet', label: 'Subnet', description: '', type: FIELD_TYPE.SELECT, options: (u, f) => getAzureSubnetOptions(u, f), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select subnet', shouldShow: true };
    const publicIP = { fieldInfo: 'info.protectionplan.network.azure.externalip', label: 'Public IP', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.SELECT, shouldShow: true, errorMessage: 'Select Public IP', options: (u, f) => getAzureExternalIPOptions(u, f), validate: (v, u) => isEmpty(v, u) };
    const securityGroup = { label: 'Security  Groups', placeHolderText: 'Security group', description: '', type: FIELD_TYPE.SELECT, shouldShow: true, options: (u, k) => getAzureSecurityGroupOption(u, k), fieldInfo: 'info.protectionplan.network.azure.security.grp' };
    const privateIPField = { fieldInfo: 'info.protectionplan.network.gcp.privateip', label: 'Private IP', placeHolderText: 'Assign New', description: '', type: FIELD_TYPE.TEXT, shouldShow: true, validate: (v, u) => validateOptionalIPAddress(v, u), errorMessage: 'Invalid ip address or ip is not in subnet cidr range' };

    return (
      <>
        <Container>
          <Card>
            <CardBody>
              <Form>
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-network`} field={networkField} user={user} />
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-subnet`} field={subnetField} user={user} />
                <DMFieldText dispatch={dispatch} fieldKey={`${networkKey}-privateIP`} field={privateIPField} user={user} />
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-publicIP`} field={publicIP} user={user} />
                <DMFieldSelect dispatch={dispatch} fieldKey={`${networkKey}-securityGroups`} field={securityGroup} user={user} />
              </Form>
            </CardBody>
          </Card>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={this.onCancel}>{t('title.cancel')}</button>
            <button type="button" className="btn btn-success" onClick={this.onSave}>{t('title.save')}</button>
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
      case PLATFORM_TYPES.VMware:
        return this.renderVMwareConfig();
      case PLATFORM_TYPES.Azure:
        return this.renderAzureConfig();
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
