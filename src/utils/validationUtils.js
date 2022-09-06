import ip from 'ip';
import { addErrorMessage, hideApplicationLoader, removeErrorMessage, showApplicationLoader, valueChange } from '../store/actions';
import { addMessage } from '../store/actions/MessageActions';
import { getVMwareVMSProps } from '../store/actions/UserActions';
import { FIELDS, FIELD_TYPE } from '../constants/FieldsConstant';
import { MESSAGE_TYPES } from '../constants/MessageConstants';
import { API_TYPES, callAPI, createPayload } from './ApiUtils';
import { API_VALIDATE_MIGRATION, API_VALIDATE_RECOVERY, API_VALIDATE_REVERSE_PLAN } from '../constants/ApiConstants';
import { getRecoveryPayload, getReversePlanPayload, getVMNetworkConfig, getVMwareNetworkConfig } from './PayloadUtil';
import { IP_REGEX } from '../constants/ValidationConstants';
import { PLATFORM_TYPES, RECOVERY_STATUS, STATIC_KEYS } from '../constants/InputConstants';
import { createVMConfigStackObject, getValue, isAWSCopyNic, validateMacAddressForVMwareNetwork, excludeKeys } from './InputUtils';

export function isRequired(value) {
  if (!value) {
    return 'Required';
  }
  return null;
}

export function validateField(field, fieldKey, value, dispatch, user) {
  const { patterns, validate, errorMessage } = field;
  // const field = FIELDS[fieldKey];
  const { type } = field;
  const { errors } = user;
  if (patterns) {
    let isValid = false;
    patterns.forEach((pattern) => {
      const re = new RegExp(pattern);
      if (value) {
        if (value.match(re) !== null) {
          isValid = true;
        }
      }
    });
    if (!isValid) {
      dispatch(addErrorMessage(fieldKey, errorMessage));
      return false;
    }
  }
  if (typeof validate === 'function') {
    if (type === FIELD_TYPE.SELECT && value === '-') {
      dispatch(addErrorMessage(fieldKey, errorMessage));
      return false;
    }
    const hasError = validate({ value, dispatch, user, fieldKey });
    if (hasError) {
      dispatch(addErrorMessage(fieldKey, errorMessage));
      return false;
    }
  }

  if (errors[fieldKey]) {
    dispatch(removeErrorMessage(fieldKey));
  }
  return true;
}

export function isEmpty({ value }) {
  return (typeof value === 'undefined' || typeof value === 'string' && value.trim() === '' || value === null);
}

export function isMemoryValueValid({ user, fieldKey }) {
  const { values } = user;
  const memVal = getValue(`${fieldKey}-memory`, values);
  const units = getValue(`${fieldKey}-unit`, values);
  if (typeof memVal === 'undefined' || typeof units === 'undefined' || memVal === '' || units === '') {
    return true;
  }
  if (memVal > 4 && units === 'TB') {
    return true;
  }
  return false;
}

export function validateConfigureSite(user, dispatch) {
  const { values } = user;
  const fields = Object.keys(FIELDS).filter((key) => key.indexOf('configureSite') !== -1);
  let isClean = true;
  fields.map((fieldKey) => {
    const field = FIELDS[fieldKey];
    const { shouldShow } = field;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (showField) {
      if (!validateField(field, fieldKey, getValue(fieldKey, values), dispatch, user)) {
        isClean = false;
      }
    } else {
      dispatch(valueChange(field, fieldKey, getValue(fieldKey, values)));
    }
  });
  return isClean;
}

export function validateSteps(user, dispatch, fields, staticFields) {
  const { values } = user;
  let isClean = true;
  fields.map((fieldKey) => {
    const field = staticFields ? staticFields[fieldKey] : FIELDS[fieldKey];
    const { shouldShow } = field;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (showField) {
      if (!validateField(field, fieldKey, getValue(fieldKey, values), dispatch, user)) {
        isClean = false;
      }
    }
  });
  return isClean;
}

export function validateDrSiteSelection({ user, fieldKey }) {
  const { values } = user;
  const fieldValue = getValue(fieldKey, values);
  const otherField = (fieldKey === 'drplan.protectedSite' ? 'drplan.recoverySite' : 'drplan.protectedSite');
  const otherFieldValue = getValue(otherField, values);
  if (!fieldValue) {
    return true;
  }
  if (fieldValue === otherFieldValue) {
    return true;
  }
  return false;
}

export function validateDRPlanProtectData({ user, dispatch }) {
  const { values } = user;
  const vmwareVMS = getValue('ui.site.vmware.selectedvms', values);
  if (typeof vmwareVMS !== 'undefined' && vmwareVMS) {
    const vmwareVMSKeys = Object.keys(vmwareVMS);
    if (!vmwareVMSKeys || vmwareVMSKeys.length === 0) {
      dispatch(addMessage('Select virtual machine.', MESSAGE_TYPES.ERROR));
      return false;
    }
    dispatch(getVMwareVMSProps(vmwareVMS));
    return true;
  }
  const vms = getValue('ui.site.seletedVMs', values);
  if (!vms || Object.keys(vms).length === 0) {
    dispatch(addMessage('Select virtual machine.', MESSAGE_TYPES.ERROR));
    return false;
  }
  return true;
}

export function noValidate() {
  return true;
}

export async function validateMigrationVMs({ user, dispatch }) {
  const { values } = user;

  const initialCheckPass = validateVMConfiguration({ user, dispatch });
  if (initialCheckPass) {
    try {
      const vms = getValue('ui.site.seletedVMs', values);
      const autoMigrate = getValue('ui.automate.migration', values);
      if (autoMigrate) {
        return true;
      }
      if (vms) {
        const payload = getRecoveryPayload(user, true);
        const obj = createPayload(API_TYPES.POST, { ...payload.recovery });
        dispatch(showApplicationLoader('VALIDATING_MIGRATION_MACHINBES', 'Validating virtual machines.'));
        const response = await callAPI(API_VALIDATE_MIGRATION, obj);
        dispatch(hideApplicationLoader('VALIDATING_MIGRATION_MACHINBES'));
        if (response.length > 0) {
          return showValidationInfo(response, dispatch);
        }
        return true;
      }
    } catch (err) {
      dispatch(hideApplicationLoader('VALIDATING_MIGRATION_MACHINBES'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      return false;
    }
  } else {
    return false;
  }
  return true;
}

export function validateVMConfiguration({ user, dispatch }) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  let fields = {};
  Object.keys(vms).forEach((vm) => {
    if (isRemovedOrRecoveredVM(vms[vm])) {
      return;
    }
    const vmConfig = createVMConfigStackObject(vm, user);
    const { data } = vmConfig;
    data.forEach((item) => {
      const { children } = item;
      Object.keys(children).forEach((key) => {
        fields = { ...fields, [key]: children[key] };
      });
    });
  });
  const response = validateSteps(user, dispatch, Object.keys(fields), fields);
  if (!response) {
    dispatch(addMessage('Check node configuration. One or more required field data is not provided.', MESSAGE_TYPES.ERROR));
    return false;
  }
  // validate Network
  return validateNetworkConfig(user, dispatch);
}

export function validateNetworkConfig(user, dispatch) {
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  switch (recoveryPlatform) {
    case PLATFORM_TYPES.AWS:
      return validateAWSNetworks(user, dispatch);
    case PLATFORM_TYPES.GCP:
      return validateCloudNetwork(user, dispatch);
    case PLATFORM_TYPES.Azure:
      return validateCloudNetwork(user, dispatch);
    default:
      return validateVMware(user, dispatch);
  }
}

export function validateCloudNetwork(user, dispatch) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  const subnets = getValue(STATIC_KEYS.UI_SUBNETS, values);
  let isClean = true;
  let message = '';
  // empty config
  const ips = [];
  Object.keys(vms).forEach((vm) => {
    if (isRemovedOrRecoveredVM(vms[vm])) {
      return;
    }
    const netConfigs = getVMNetworkConfig(`${vm}`, values);
    const vpc = [];
    const vmName = vms[vm].name;
    if (netConfigs.length === 0) {
      message = `${vmName}: Network configuration required`;
      isClean = false;
    } else {
      for (let i = 0; i < netConfigs.length; i += 1) {
        if (netConfigs[i].subnet === '') {
          message = `${vmName}: Network configure missing for nic-${i}`;
          isClean = false;
        }
        if (typeof netConfigs.privateIP !== 'undefined' && netConfigs.privateIP !== '') {
          ips.push(netConfigs.privateIP);
        }
        if (typeof netConfigs.publicIP !== 'undefined' && netConfigs.publicIP !== '') {
          ips.push(netConfigs.publicIP);
        }
        for (let j = 0; j < subnets.length; j += 1) {
          if (subnets[j].id === netConfigs[i].subnet) {
            vpc.push(subnets[j].vpcID);
          }
        }
      }
      // unique network check
      const vpcSet = [...new Set(vpc)];
      if (vpcSet.length !== vpc.length && message === '') {
        message = `${vmName}: network must be unique for each interface`;
        isClean = false;
      }
    }
  });
  // duplicate ip check
  const ipSet = [...new Set(ips)];
  if (ipSet.length !== ips.length && message === '') {
    message = 'Duplicate ip address not allowed';
    isClean = false;
  }
  if (!isClean) {
    dispatch(addMessage(message, MESSAGE_TYPES.ERROR));
  }
  return isClean;
}

export function validateAWSNetworks(user, dispatch) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  // const subnets = getValue(STATIC_KEYS.UI_SUBNETS, values);
  const elasticIPs = [];
  let isClean = true;
  let message = '';
  const messages = [];
  Object.keys(vms).forEach((vm) => {
    if (isRemovedOrRecoveredVM(vms[vm])) {
      return;
    }
    const netConfigs = getVMNetworkConfig(`${vm}`, values);
    const vmName = vms[vm].name;
    if (netConfigs.length === 0) {
      message = `${vmName}: Network configuration required`;
      messages.push(message);
      isClean = false;
    }
    const vpc = [];
    const zones = [];
    for (let i = 0; i < netConfigs.length; i += 1) {
      if (netConfigs[i].subnet === '') {
        isClean = false;
        message = `${vmName}: Subnet missing for Nic-${i}`;
        messages.push(message);
      }
      if (netConfigs[i].securityGroups === '' || typeof netConfigs[i].securityGroups === 'undefined') {
        isClean = false;
        message = `${vmName}: SecurityGroup missing for Nic-${i}`;
        messages.push(message);
      }
      if (typeof netConfigs[i].network !== 'undefined' && netConfigs[i].network !== '') {
        elasticIPs.push(netConfigs[i].network);
      }
      vpc.push(netConfigs[i].vpcId);
      zones.push(netConfigs[i].availZone);
      // for (let j = 0; j < subnets.length; j += 1) {
      //   if (subnets[j].id === netConfigs[i].subnet) {
      //     vpc.push(subnets[j].vpcID);
      //   }
      // }
    }

    const vpcSet = [...new Set(vpc)];
    // nics with different vpcid
    if (vpcSet.length > 1) {
      message = `${vmName}: All nics of an instance must belong to same VPC.`;
      messages.push(message);
      isClean = false;
    }

    const zoneSet = [...new Set(zones)];
    // nics with different vpcid
    if (zoneSet.length > 1) {
      message = `${vmName}: All nics of an instance must belong to same Availability Zone.`;
      messages.push(message);
      isClean = false;
    }
  });
  // check if same elastic ip mapped with multiple networks or vms
  const duplicates = elasticIPs
    .filter((ipAddr, index) => elasticIPs.indexOf(ipAddr) !== index)
    .filter((i) => i !== '-');
  if (duplicates.length > 0) {
    isClean = false;
    message = 'Same elastic ip is mapped with multiple networks';
    messages.push(message);
  }

  if (!isClean) {
    dispatch(addMessage(messages.join(', '), MESSAGE_TYPES.ERROR));
  }
  return isClean;
}

export function validateVMware(user, dispatch) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  let isClean = true;
  let message = '';
  Object.keys(vms).forEach((vm) => {
    if (isRemovedOrRecoveredVM(vms[vm])) {
      return;
    }
    const netConfigs = getVMwareNetworkConfig(`${vm}`, values);
    const vmName = vms[vm].name;
    if (netConfigs.length === 0) {
      message = `${vmName}: Network configuration required`;
      isClean = false;
    }
    for (let i = 0; i < netConfigs.length; i += 1) {
      if (netConfigs[i].network === '' || typeof netConfigs[i].network === 'undefined') {
        isClean = false;
        message = `${vmName}: network is  missing for Nic-${i}`;
      } else if (typeof netConfigs[i].adapterType === 'undefined') {
        isClean = false;
        message = `${vmName}: adapterType missing for Nic-${i}`;
      }
    }
  });
  if (!isClean) {
    dispatch(addMessage(message, MESSAGE_TYPES.ERROR));
  }
  return isClean;
}

export async function validateRecoveryVMs({ user, dispatch }) {
  const { values } = user;

  const initialCheckPass = validateVMConfiguration({ user, dispatch });

  if (initialCheckPass) {
    try {
      const vms = getValue('ui.site.seletedVMs', values);
      if (vms) {
        const payload = getRecoveryPayload(user);
        const obj = createPayload(API_TYPES.POST, { ...payload.recovery });
        dispatch(showApplicationLoader('VALIDATING_RECOVERY_MACHINES', 'Validating virtual machines.'));
        const response = await callAPI(API_VALIDATE_RECOVERY, obj);
        dispatch(hideApplicationLoader('VALIDATING_RECOVERY_MACHINES'));
        if (response.length > 0) {
          return showValidationInfo(response, dispatch);
        }
        return true;
      }
    } catch (err) {
      dispatch(hideApplicationLoader('VALIDATING_RECOVERY_MACHINES'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      return false;
    }
  } else {
    return false;
  }
  return true;
}

export function validateForm(formKey, user, dispatch) {
  const { values } = user;
  const fields = Object.keys(FIELDS).filter((key) => key.indexOf(formKey) !== -1);
  let isClean = true;
  fields.map((fieldKey) => {
    const field = FIELDS[fieldKey];
    const { shouldShow, validate, patterns } = field;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (showField && (typeof validate !== 'undefined' || typeof patterns !== 'undefined')) {
      if (!validateField(field, fieldKey, getValue(fieldKey, values), dispatch, user)) {
        isClean = false;
      }
    }
  });
  return isClean;
}

export function validatePassword({ value, user }) {
  const { values } = user;
  const password = getValue('user.newPassword', values);
  return value !== password;
}

export function validateReplicationValue({ user }) {
  const { values = {} } = user;
  const d = getValue('ui.values.replication.interval.days', values);
  const h = getValue('ui.values.replication.interval.hours', values);
  const m = getValue('ui.values.replication.interval.min', values);
  const z = '0';
  if (d !== z || h !== z && m !== z) {
    return true;
  }
  return false;
}

export async function validateReversePlan({ user, dispatch }) {
  const initialCheckPass = validateReverseData({ user, dispatch });
  if (initialCheckPass) {
    try {
      const drplan = getReversePlanPayload(user);
      const obj = createPayload(API_TYPES.POST, { ...drplan });
      const url = API_VALIDATE_REVERSE_PLAN.replace('<id>', drplan.id);
      dispatch(showApplicationLoader('VALIDATING_REVERSE_PLAN', 'Validating reverse plan.'));
      const response = await callAPI(url, obj);
      dispatch(hideApplicationLoader('VALIDATING_REVERSE_PLAN'));
      if (!response.isRecoverySiteOnline) {
        dispatch(addMessage('Recovery site is not reachable. Please select a different recovery site.', MESSAGE_TYPES.ERROR, true));
        return false;
      }
      if (response.failedEntities === null) {
        return true;
      }
      if (response.failedEntities.length !== 0) {
        dispatch(addMessage(`[${response.failedEntities.join(', ')}] The last replication job has failed or snapshots across the sites are not in sync. Please select full incremental for replication type.`, MESSAGE_TYPES.ERROR, true));
      }
      return false;
    } catch (err) {
      dispatch(hideApplicationLoader('VALIDATING_REVERSE_PLAN'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      return false;
    }
  } else {
    return false;
  }
}

export function validateReverseData({ user, dispatch }) {
  const { values } = user;
  const sufixField = FIELDS['reverse.suffix'];
  const repltypeField = FIELDS['reverse.replType'];
  const recoverySiteField = FIELDS['reverse.recoverySite'];
  if (!validateField(recoverySiteField, 'reverse.recoverySite', getValue('reverse.recoverySite', values), dispatch, user) || !validateField(repltypeField, 'reverse.replType', getValue('reverse.replType', values), dispatch, user) || !validateField(sufixField, 'reverse.suffix', getValue('reverse.suffix', values), dispatch, user)) {
    return false;
  }
  return true;
}

export function validateOptionalIPAddress({ value }) {
  if (value !== '') {
    const re = new RegExp(IP_REGEX);
    const ips = value.split(',');
    let hasError = false;
    ips.forEach((v) => {
      if (v.match(re) === null) {
        hasError = true;
      }
    });
    return hasError;
  }
  return false;
}

export function validateNicConfig(dispatch, user, options) {
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  switch (recoveryPlatform) {
    case PLATFORM_TYPES.AWS:
      return validateAWSNic(dispatch, user, options);
    case PLATFORM_TYPES.GCP:
      return validateGCPNicConfig(dispatch, user, options);
    case PLATFORM_TYPES.VMware:
      return validateVMwareNicConfig(dispatch, user, options);
    case PLATFORM_TYPES.Azure:
      return validateAzureNicConfig(dispatch, user, options);
    default:
      return true;
  }
}

function validateGCPNicConfig(dispatch, user, options) {
  const { values, errors } = user;
  const { networkKey } = options;
  const subnet = getValue(`${networkKey}-subnet`, values) || '';
  const pvtIP = getValue(`${networkKey}-privateIP`, values) || '';
  const pubIP = getValue(`${networkKey}-publicIP`, values) || '';
  if (subnet === '' || subnet === '-') {
    dispatch(addMessage('Select network subnet', MESSAGE_TYPES.ERROR));
    return false;
  }
  if (pvtIP !== '') {
    if (errors && errors[`${networkKey}-privateIP`]) {
      return false;
    }
    // get subnet CIDR
    const subnets = getValue(STATIC_KEYS.UI_SUBNETS, values);
    let subnetCidr = '';
    subnets.forEach((sub) => {
      if (sub.id === subnet) {
        subnetCidr = sub.name;
      }
    });
    if (pvtIP !== '' && !isIPsPartOfCidr(subnetCidr, pvtIP)) {
      dispatch(addMessage(`Private ip address ${pvtIP} not fall in the ${subnetCidr} range.`, MESSAGE_TYPES.ERROR));
      return false;
    }
  }
  if (pubIP === '') {
    dispatch(addMessage('Select external ip config', MESSAGE_TYPES.ERROR));
    return false;
  }
  return true;
}

function validateVMwareNicConfig(dispatch, user, options) {
  const { values } = user;
  const { networkKey } = options;
  const network = getValue(`${networkKey}-network`, values) || '';
  const adapterType = getValue(`${networkKey}-adapterType`, values) || '';
  const macAddress = getValue(`${networkKey}-macAddress-value`, values) || '';
  if (network === '' || network === '-') {
    dispatch(addMessage('Select network', MESSAGE_TYPES.ERROR));
    return false;
  }
  if (adapterType === '') {
    dispatch(addMessage('Adapter type is required', MESSAGE_TYPES.ERROR));
    return false;
  }

  if (macAddress) {
    const validMac = validateMacAddressForVMwareNetwork(macAddress);
    if (!validMac) {
      dispatch(addMessage('Please fill the right mac Address', MESSAGE_TYPES.ERROR));
      return false;
    }
  }
  return true;
}

function validateAzureNicConfig(dispatch, user, options) {
  const { values } = user;
  const { networkKey } = options;
  const subnet = getValue(`${networkKey}-subnet`, values) || '';
  const pubIP = getValue(`${networkKey}-publicIP`, values) || '';
  const network = getValue(`${networkKey}-network`, values) || '';
  const sg = getValue(`${networkKey}-securityGroups`, values) || [];
  if (network === '') {
    dispatch(addMessage('Please select the network', MESSAGE_TYPES.ERROR));
    return false;
  }
  if (subnet === '' || subnet === '-') {
    dispatch(addMessage('Select network subnet', MESSAGE_TYPES.ERROR));
    return false;
  }

  if (pubIP === '') {
    dispatch(addMessage('Select external ip config', MESSAGE_TYPES.ERROR));
    return false;
  }
  if (sg.length === 0) {
    dispatch(addMessage('Select security group', MESSAGE_TYPES.ERROR));
    return false;
  }
  return true;
}

function validateAWSNic(dispatch, user, options) {
  const { networkKey } = options;
  const { values, errors } = user;
  const subnet = getValue(`${networkKey}-subnet`, values);
  const availZone = getValue(`${networkKey}-availZone`, values);
  const vpc = getValue(`${networkKey}-vpcId`, values);
  const pvtIP = getValue(`${networkKey}-privateIP`, values) || '';
  const sg = getValue(`${networkKey}-securityGroups`, values) || [];
  const isCopyConfiguration = isAWSCopyNic(`${networkKey}-subnet`, '-subnet', user);
  if (vpc === '' || vpc === '-') {
    dispatch(addMessage('Select VPC', MESSAGE_TYPES.ERROR));
    return false;
  }
  if (subnet === '' || subnet === '-') {
    dispatch(addMessage('Select network subnet', MESSAGE_TYPES.ERROR));
    return false;
  }
  if (availZone === '' || availZone === '-') {
    dispatch(addMessage('Select availability zone', MESSAGE_TYPES.ERROR));
    return false;
  }
  if (pvtIP !== '') {
    if (errors && errors[`${networkKey}-privateIP`]) {
      return false;
    }
  }
  if (sg.length === 0) {
    dispatch(addMessage('Select security group', MESSAGE_TYPES.ERROR));
    return false;
  }
  const sgsKey = (isCopyConfiguration === true ? STATIC_KEYS.UI_SECURITY_GROUPS_SOURCE : STATIC_KEYS.UI_SECURITY_GROUPS);
  const subnetKey = (isCopyConfiguration === true ? STATIC_KEYS.UI_SUBNETS__SOURCE : STATIC_KEYS.UI_SUBNETS);
  const vpcs = getValue(STATIC_KEYS.UI_VPC_TARGET, values);
  const sgs = getValue(sgsKey, values) || [];
  const subnets = getValue(subnetKey, values);
  let subnetVPCID = 0;
  let subnetCidr = '';
  subnets.forEach((sub) => {
    if (sub.id === subnet) {
      subnetCidr = sub.cidr;
      subnetVPCID = sub.vpcID;
    }
    if (sub.id === subnet && sub.vpcID !== vpc && !isCopyConfiguration) {
      dispatch('Subnet must be part of the provided VPC');
      return false;
    }
  });
  // check private ips fall in the subnet
  if (pvtIP !== '' && !isIPsPartOfCidr(subnetCidr, pvtIP)) {
    dispatch(addMessage(`Private IP address ${pvtIP} does not fall in the ${subnetCidr} range.`, MESSAGE_TYPES.ERROR));
    return false;
  }
  const vpcIDs = [];
  sgs.forEach((g) => {
    sg.forEach((s) => {
      if (g.id === s) {
        vpcIDs.push(g.vpcID);
      }
    });
  });
  const vpcSet = [...new Set(vpcIDs)];
  if (vpcSet.length > 1) {
    dispatch(addMessage('Security group must be from same VPC.'));
    return false;
  }
  // check subnet and sgs from same vpc
  if (vpcSet[0] !== subnetVPCID) {
    dispatch(addMessage('Security group and subnet must be from same VPC.'));
    return false;
  }
  // vpc to subnet cidr
  const vpcCidr = vpcs.filter((v) => v.id === vpc);
  if (vpcCidr.length > 0) {
    if (!vpcSubnetMatch(vpcCidr[0].cidr, subnetCidr)) {
      dispatch(addMessage('Subnet CIDR does not fall under selected VPC range. Please select another subnet.'));
      return false;
    }
  }
  return true;
}

export function validateReplicationInterval({ value, dispatch }) {
  try {
    if (Number.isNaN(value, 2)) {
      dispatch(addMessage('Select replication interval', MESSAGE_TYPES.ERROR));
      return true;
    }
    if (value <= 0) {
      dispatch(addMessage('Select replication interval', MESSAGE_TYPES.ERROR));
      return true;
    }
    if (value < 10) {
      dispatch(addMessage('Minimum replication interval is 10 minutes', MESSAGE_TYPES.ERROR));
      return true;
    }
  } catch (err) {
    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    return true;
  }
  return false;
}

export function isPlanRecovered(protectionplan) {
  const { recoveryStatus } = protectionplan;
  if (recoveryStatus === 'Migrated' || recoveryStatus === 'Recovered') {
    return true;
  }
  return false;
}

export function isVMRecovered(vm) {
  const { recoveryStatus } = vm;
  if (recoveryStatus === 'Migrated' || recoveryStatus === 'Recovered') {
    return true;
  }
  return false;
}
export function vpcSubnetMatch(vpcCidr, subnetCidr) {
  if (vpcCidr === '' || subnetCidr === '') {
    return false;
  }
  const associatedCIDRs = vpcCidr.split(',');
  let isSubnetAssociated = false;
  const sub = ip.cidrSubnet(subnetCidr);
  for (let i = 0; i < associatedCIDRs.length; i += 1) {
    const vpc = ip.cidrSubnet(associatedCIDRs[i]);
    if (vpc && sub) {
      const firstIPMatch = ip.cidrSubnet(associatedCIDRs[i]).contains(sub.firstAddress);
      const lastIPMatch = ip.cidrSubnet(associatedCIDRs[i]).contains(sub.lastAddress);
      if (firstIPMatch && lastIPMatch) {
        isSubnetAssociated = true;
        break;
      }
    }
  }
  return isSubnetAssociated;
}

export function isIPsPartOfCidr(cidr, ipAddr) {
  if (cidr === '' || typeof cidr === 'undefined') {
    return false;
  }
  // get subnet details
  const cidrInfo = ip.cidrSubnet(cidr);
  if (cidrInfo) {
    const ips = ipAddr.split(',');
    for (let i = 0; i < ips.length; i += 1) {
      const hasNonRangeIP = cidrInfo.contains(ips[i]);
      if (!hasNonRangeIP) {
        return false;
      }
    }
  }
  return true;
}

function showValidationInfo(response = [], dispatch) {
  const errors = response.filter((res) => (res && res.isWarning === false));
  const warnings = response.filter((res) => (res && res.isWarning === true));
  if (errors.length > 0) {
    errors.forEach((e) => {
      dispatch(addMessage(`${e.vmName} - ${e.message}`, MESSAGE_TYPES.ERROR));
    });
    return false;
  }
  if (warnings.length > 0) {
    warnings.forEach((w) => {
      dispatch(addMessage(`${w.vmName} - ${w.message}`, MESSAGE_TYPES.WARNING));
    });
  }
  return true;
}

export function validateVMSelection(user, dispatch) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  if (typeof vms === 'undefined' || Object.keys(vms).length === 0) {
    dispatch(addMessage('Select virtual machines', MESSAGE_TYPES.ERROR));
    return false;
  }
  return true;
}

export function changedVMRecoveryConfigurations(payload, user, dispatch) {
  const { values } = user;
  const { instanceDetails } = payload.drplan.recoveryEntities;
  const recoverVms = getValue('ui.site.recoveryEntities', values);
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  let res = false;
  res = checkChangesForArrayInObject(recoverVms, instanceDetails, recoveryPlatform, 'sourceMoref');
  if (res) {
    dispatch(addMessage('Changes on recovery machine will be applied in next replication', MESSAGE_TYPES.WARNING));
  }
}

export function checkChangesForArrayInObject(recoveryArr, payloadArr, recoveryPlatform, condition) {
  let clear = false;
  if (payloadArr.length !== recoveryArr.length) {
    return true;
  }
  // all the fields which are empty and are in EXCLUDE_KEYS_RECOVERY_CONFIGURATION keys list all of them will be discarded from getting checked
  for (let i = 0; i < payloadArr.length; i += 1) {
    const keys = Object.keys(recoveryArr[i]);
    const rvm = recoveryArr[i];
    const ins = payloadArr[i];
    if (rvm[condition] === ins[condition]) {
      for (let k = 0; k < keys.length; k += 1) {
        if (keys[k] === 'networks') {
          clear = checkChangesForArrayInObject(rvm[keys[k]], ins[keys[k]], recoveryPlatform, 'id');
          if (clear) {
            return clear;
          }
        } else if (rvm[keys[k]] !== '' && excludeKeys(keys[k], recoveryPlatform) && rvm[keys[k]] !== ins[keys[k]] && keys[k] !== 'tags') {
          if (keys[k] === 'Subnet') {
            if (rvm[keys[k]] !== ins.subnet) {
              return true;
            }
          } else {
            return true;
          }
        } else if (keys[k] === 'tags') {
          if (rvm[keys[k]].length !== ins[keys[k]].length) {
            return true;
          }
        }
      }
    }
  }
  return clear;
}

export function validateMemoryValue({ value, user, fieldKey }) {
  const { values } = user;
  const unitKey = `${fieldKey}-unit`;
  const unitValue = getValue(unitKey, values);
  if (value > 4 && unitValue === 'TB') {
    return true;
  }
  return (typeof value === 'undefined' || typeof value === 'string' && value.trim() === '' || value === null);
}

export function isRemovedOrRecoveredVM(vm) {
  if (typeof vm === 'object' && vm.isDeleted || vm.isRemovedFromPlan
      || vm.recoveryStatus === RECOVERY_STATUS.MIGRATED || vm.recoveryStatus === RECOVERY_STATUS.RECOVERED) {
    return true;
  }
  return false;
}
