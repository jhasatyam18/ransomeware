import i18n from 'i18next';
import ip from 'ip';
import { API_VALIDATE_MIGRATION, API_VALIDATE_RECOVERY, API_VALIDATE_REVERSE_PLAN } from '../constants/ApiConstants';
import { FIELDS } from '../constants/FieldsConstant';
import { CHECKPOINT_TYPE, PLATFORM_TYPES, RECOVERY_STATUS, STATIC_KEYS, UI_WORKFLOW } from '../constants/InputConstants';
import { MESSAGE_TYPES } from '../constants/MessageConstants';
import { STORE_KEYS } from '../constants/StoreKeyConstants';
import { GENERAL_PLATFORM_KEYS, PLAN_KEYS } from '../constants/UserConstant';
import { IP_REGEX } from '../constants/ValidationConstants';
import { addErrorMessage, hideApplicationLoader, removeErrorMessage, showApplicationLoader, valueChange } from '../store/actions';
import { setVMGuestOSInfo } from '../store/actions/DrPlanActions';
import { addMessage } from '../store/actions/MessageActions';
import { getVMwareVMSProps } from '../store/actions/UserActions';
import { API_TYPES, callAPI, createPayload } from './ApiUtils';
import { convertMinutesToDaysHourFormat } from './AppUtils';
import { createVMConfigStackObject, excludeKeys, getValue, isAWSCopyNic, validateMacAddressForVMwareNetwork } from './InputUtils';
import { getRecoveryPayload, getRecoveryPointTimePeriod, getReplicationInterval, getReversePlanPayload, getVMNetworkConfig, getVMwareNetworkConfig } from './PayloadUtil';

export function isRequired(value) {
  if (!value) {
    return 'Required';
  }
  return null;
}

export function validateField(field, fieldKey, value, dispatch, user, emptyFields = []) {
  const { patterns, validate, errorMessage } = field;
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
      emptyFields.push(`${field.label}`);
      return false;
    }
  }
  if (typeof validate === 'function') {
    const hasError = validate({ value, dispatch, user, fieldKey });
    if (hasError) {
      dispatch(addErrorMessage(fieldKey, errorMessage));
      emptyFields.push(`${field.label}`);
      return false;
    }
  }

  if (errors[fieldKey]) {
    dispatch(removeErrorMessage(fieldKey));
  }
  return true;
}

export function isEmpty({ value }) {
  let val = value;
  if (typeof value === 'object' && value !== null) {
    if (value.length > 0) {
      val = value;
    } else {
      val = value.value;
    }
  }
  return (typeof val === 'undefined' || typeof val === 'string' && val.trim() === '' || val === null || val.length === 0);
}

export function isEmptyNum({ value }) {
  return (typeof value === 'number' && value === 0);
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

export function validateSteps(user, dispatch, fields, staticFields, emptyFields = []) {
  const { values } = user;
  let isClean = true;
  fields.map((fieldKey) => {
    const field = staticFields ? staticFields[fieldKey] : FIELDS[fieldKey];
    const { shouldShow } = field;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (showField) {
      if (!validateField(field, fieldKey, getValue(fieldKey, values), dispatch, user, emptyFields)) {
        isClean = false;
      }
    }
  });
  return isClean;
}

export function validateDrSiteSelection({ user, fieldKey, value, dispatch }) {
  const { values, errors } = user;
  const otherField = (fieldKey === 'drplan.protectedSite' ? 'drplan.recoverySite' : 'drplan.protectedSite');
  const otherFieldValue = getValue(otherField, values) || '';
  if (!value) {
    return true;
  }
  if (`${value}` === `${otherFieldValue}`) {
    return true;
  }

  // if both recovery and protected site are diffrent then remove error from the other field
  if (errors[otherField] && otherFieldValue !== '') {
    dispatch(removeErrorMessage(otherField));
  }
  return false;
}

export const checkCBTStatus = ({ user, dispatch }) => {
  const { values } = user;
  const isMoveNext = getValue(STATIC_KEYS.UI_DMWIZARD_MOVENEXT, values);
  if (isMoveNext) {
    const statusOfCBT = { moveNext: isMoveNext };
    dispatch(valueChange(STATIC_KEYS.UI_DMWIZARD_MOVENEXT, false));
    return statusOfCBT;
  }
  return null;
};

export async function validateDRPlanProtectData({ user, dispatch }) {
  const { values } = user;
  const vmwareVMS = getValue('ui.site.vmware.selectedvms', values);
  if (typeof vmwareVMS !== 'undefined' && vmwareVMS) {
    // Below code is to fetch the datacenter from the the source dev center and in case of test recovery we don't want it
    const workFlow = getValue(STATIC_KEYS.UI_WORKFLOW, values) || '';
    if (workFlow !== UI_WORKFLOW.TEST_RECOVERY) {
      const vmwareVMSKeys = Object.keys(vmwareVMS);
      if (!vmwareVMSKeys || vmwareVMSKeys.length === 0) {
        dispatch(addMessage('Select virtual machine.', MESSAGE_TYPES.ERROR));
        return false;
      }

      try {
        const res = await getVMwareVMSProps(vmwareVMS, dispatch, user);
        return res;
      } catch (error) {
        return false;
      }
    }
  }
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  if (!vms || Object.keys(vms).length === 0) {
    dispatch(addMessage('Select virtual machine.', MESSAGE_TYPES.ERROR));
    return false;
  }
  dispatch(setVMGuestOSInfo(vms));
  return true;
}

export function validateInTargetDRPLanProtectedData({ user, dispatch }) {
  const { values } = user;
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
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

  const validateSelectedVms = validateVMSelection(user, dispatch);
  if (validateSelectedVms) {
    const initialCheckPass = validateVMConfiguration({ user, dispatch });
    if (initialCheckPass) {
      try {
        const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
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
    }
  } else {
    return false;
  }
  return true;
}

export function validateVMConfiguration({ user, dispatch }) {
  const { values } = user;
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  // let fields = {};
  const vmName = [];
  if (Object.keys(vms).length === 0) {
    dispatch(addMessage('Please select a virtual machine for protection', MESSAGE_TYPES.ERROR));
    return false;
  }
  Object.keys(vms).forEach((vm) => {
    if (isRemovedOrRecoveredVM(vms[vm])) {
      return;
    }
    const vmConfig = createVMConfigStackObject(vm, user);
    const { data } = vmConfig;
    let fields = {};
    const emptyFields = [];
    data.forEach((item) => {
      const { children } = item;
      Object.keys(children).forEach((key) => {
        fields = { ...fields, [key]: children[key] };
      });
    });
    const response = validateSteps(user, dispatch, Object.keys(fields), fields, emptyFields);
    if (!response) {
      vmName.push(`${emptyFields.join(', ')} of ${vms[vm].name}`);
    }
  });
  if (vmName.length > 0) {
    dispatch(addMessage(`Please fill the required field(s) ${vmName.join(' , ')}`, MESSAGE_TYPES.ERROR));
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
      return validateGCPNetwork(user, dispatch);
    case PLATFORM_TYPES.Azure:
      return validateAzureNetwork(user, dispatch);
    default:
      return validateVMware(user, dispatch);
  }
}

export function validateGCPNetwork(user, dispatch) {
  const { values } = user;
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
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
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
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
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
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

export function validateAzureNetwork(user, dispatch) {
  const { values } = user;
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const subnets = getValue(STATIC_KEYS.UI_SUBNETS, values);
  let isClean = true;
  let message = '';
  const messages = [];
  // empty config
  const ips = [];
  const publicIP = [];
  Object.keys(vms).forEach((vm) => {
    if (isRemovedOrRecoveredVM(vms[vm])) {
      return;
    }
    const netConfigs = getVMNetworkConfig(`${vm}`, values);
    const vpc = [];
    const net = [];
    const vmName = vms[vm].name;
    if (netConfigs.length === 0) {
      message = `${vmName}: Network configuration required`;
      messages.push(message);
      isClean = false;
    } else {
      for (let i = 0; i < netConfigs.length; i += 1) {
        if (netConfigs[i].subnet === '') {
          isClean = false;
          message = `${vmName}: Network configure missing for nic-${i}`;
          messages.push(message);
        }
        if (typeof netConfigs[i].privateIP !== 'undefined' && netConfigs[i].privateIP !== '') {
          ips.push(netConfigs[i].privateIP);
        }
        if (typeof netConfigs[i].publicIP !== 'undefined' && netConfigs[i].publicIP !== '') {
          publicIP.push(netConfigs[i].publicIP);
        }
        for (let j = 0; j < subnets.length; j += 1) {
          if (subnets[j].id === netConfigs[i].subnet) {
            vpc.push(subnets[j].vpcID);
          }
        }
        net.push(netConfigs[i].network);
      }
      // unique network check
      const vpcSet = [...new Set(vpc)];
      const netSet = [...new Set(net)];
      // nics with different vpcid
      if (vpcSet.length > 1) {
        message = `${vmName}: All nics of an instance must belong to same VPC.`;
        messages.push(message);
        isClean = false;
      }
      if (netSet.length > 1) {
        message = `${vmName}: All the virtual networks for a vm should be same.`;
        messages.push(message);
        isClean = false;
      }
    }
  });

  const ipSet = [...new Set(ips)];
  const publicIpSet = [...new Set(publicIP)];
  if (ipSet.length !== ips.length && message === '') {
    message = 'Duplicate ip address not allowed';
    messages.push(message);
    isClean = false;
  }
  if (publicIpSet.length !== publicIP.length && message === '') {
    message = 'Duplicate Public ip address not allowed';
    messages.push(message);
    isClean = false;
  }
  if (!isClean) {
    dispatch(addMessage(messages.join(', '), MESSAGE_TYPES.ERROR));
  }
  return isClean;
}

export async function validateRecoveryVMs({ user, dispatch }) {
  const { values } = user;
  const isVMSelected = validateVMSelection(user, dispatch);
  if (isVMSelected) {
    const initialCheckPass = validateVMConfiguration({ user, dispatch });
    if (initialCheckPass) {
      try {
        const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
        if (vms) {
          const payload = getRecoveryPayload(user);
          const obj = createPayload(API_TYPES.POST, { ...payload.recovery });
          dispatch(showApplicationLoader('VALIDATING_RECOVERY_MACHINES', 'Validating virtual machines.'));
          const response = await callAPI(API_VALIDATE_RECOVERY, obj);
          dispatch(hideApplicationLoader('VALIDATING_RECOVERY_MACHINES'));

          if (response.length > 0) {
            let warningMsg = i18n.t('recovery.discard.warning.msg');
            const warningVMS = [];
            response.forEach((res) => {
              const { message, vmName } = res;
              warningMsg = warningMsg.replace('vmName', vmName);
              if (message === warningMsg) {
                warningVMS.push(vmName);
              }
            });
            dispatch(valueChange('recovery.discard.warning.vms', warningVMS));
            dispatch(valueChange('recovery.discardPartialChanges', true));
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
  return false;
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
  try {
    const drplan = getReversePlanPayload(user);
    const obj = createPayload(API_TYPES.POST, { ...drplan });
    const url = API_VALIDATE_REVERSE_PLAN.replace('<id>', drplan.id);
    dispatch(showApplicationLoader('VALIDATING_REVERSE_PLAN', 'Validating reverse plan.'));
    const response = await callAPI(url, obj);
    if (!response.isRecoverySiteOnline) {
      dispatch(addMessage('Recovery site is not reachable. Please select a different recovery site.', MESSAGE_TYPES.ERROR));
      return false;
    }
    if (response.failedEntities === null) {
      return true;
    }
    if (response.failedEntities.length !== 0) {
      const { failedEntities } = response;
      const failureObj = {};
      const errorMsg = [];
      failedEntities.forEach((element) => {
        const { failedEntity } = element;
        const { failureMessage } = element;
        if (typeof failureObj[failureMessage] === 'undefined') {
          failureObj[failureMessage] = [failedEntity];
        } else {
          failureObj[failureMessage].push(failedEntity);
        }
      });
      if (Object.keys(failureObj).length !== 0) {
        Object.keys(failureObj).forEach((key, index) => {
          if (index !== (Object.keys(failureObj).length - 1)) {
            errorMsg.push(`${key} for ${failureObj[key].join(', ')}; `);
          } else {
            errorMsg.push(`${key} for ${failureObj[key].join(', ')}`);
          }
        });
      }
      dispatch(addMessage(i18n.t('error.reverse.validation', { error: errorMsg.join('') }), MESSAGE_TYPES.ERROR));
    }
    return false;
  } catch (err) {
    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    return false;
  } finally {
    dispatch(hideApplicationLoader('VALIDATING_REVERSE_PLAN'));
  }
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
  const macAddress = getValue(`${networkKey}-macAddress`, values) || '';
  const staticip = getValue(`${networkKey}-isPublic`, values) || '';
  if (network === '' || network === '-' || network?.value === '') {
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
      dispatch(addMessage('Please provide valid mac Address', MESSAGE_TYPES.ERROR));
      return false;
    }
  }
  if (staticip) {
    const Ip = getValue(`${networkKey}-publicIP`, values) || '';
    const subnet = getValue(`${networkKey}-netmask`, values) || '';
    const gateway = getValue(`${networkKey}-gateway`, values) || '';
    const dns = getValue(`${networkKey}-dnsserver`, values) || '';
    const validated = dispatch(validateForStaticIP({ Ip, subnet, gateway, dns }));
    if (!validated) {
      return false;
    }
  }
  return true;
}

function validateForStaticIP({ Ip, subnet, gateway, dns }) {
  return (dispatch) => {
    if (!validateIps(Ip)) {
      dispatch(addMessage(i18n.t('warning.vmware.ip.addr'), MESSAGE_TYPES.ERROR));
      return false;
    }
    if (!validateIps(subnet)) {
      dispatch(addMessage(i18n.t('warning.vmware.netmask'), MESSAGE_TYPES.ERROR));
      return false;
    }
    if (!validateIps(gateway)) {
      dispatch(addMessage(i18n.t('warning.vmware.gateway'), MESSAGE_TYPES.ERROR));
      return false;
    }

    if (!validateDNS(dns)) {
      dispatch(addMessage(i18n.t('warning.vmware.dns'), MESSAGE_TYPES.ERROR));
      return false;
    }
    return true;
  };
}

function validateIps(value) {
  const IP = new RegExp(IP_REGEX);
  if (value.match(IP) === null || value === '') {
    return false;
  }
  return true;
}

function validateAzureNicConfig(dispatch, user, options) {
  const { values } = user;
  const { networkKey } = options;
  const subnet = getValue(`${networkKey}-subnet`, values) || '';
  const pubIP = getValue(`${networkKey}-publicIP`, values) || '';
  const network = getValue(`${networkKey}-network`, values) || '';
  if (network === '' || network?.value === '') {
    dispatch(addMessage('Please select the network', MESSAGE_TYPES.ERROR));
    return false;
  }
  if (subnet === '' || subnet === '-') {
    dispatch(addMessage('Select network subnet', MESSAGE_TYPES.ERROR));
    return false;
  }

  if (pubIP === '') {
    dispatch(addMessage('Select Public ip config', MESSAGE_TYPES.ERROR));
    return false;
  }
  return true;
}
function validateDNS(dns) {
  const Dns = dns.split(',');
  if (Dns.length > 0) {
    for (let i = 0; i < Dns.length; i += 1) {
      if (!validateIps(Dns[i])) {
        return false;
      }
    }
  } else {
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

export function validateReplicationInterval({ value, dispatch, user }) {
  try {
    const { values } = user;

    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);

    if (Number.isNaN(value, 2)) {
      dispatch(addMessage('Select replication interval', MESSAGE_TYPES.ERROR));

      return true;
    }

    if (value <= 0) {
      dispatch(addMessage('Select replication interval', MESSAGE_TYPES.ERROR));

      return true;
    }

    // aws vmware and azure min replication interval is 1 minutes

    if (recoveryPlatform !== PLATFORM_TYPES.GCP) {
      if (value < 1) {
        dispatch(addMessage(`Minimum replication interval is 1 minute for platform ${recoveryPlatform}`, MESSAGE_TYPES.ERROR));

        return true;
      }
    }

    // GCP min replication interval is 10 minutes

    if (recoveryPlatform === PLATFORM_TYPES.GCP && value < 10) {
      dispatch(addMessage(`Minimum replication interval is 10 minute for platform ${recoveryPlatform}`, MESSAGE_TYPES.ERROR));

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
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  if (typeof vms === 'undefined' || Object.keys(vms).length === 0) {
    dispatch(addMessage('Select virtual machines', MESSAGE_TYPES.ERROR));
    return false;
  }
  const recoveryPath = getValue(STATIC_KEYS.UI_CHECKPOINT_RECOVERY_TYPE, values);
  // Recovery checkpoint based on point-in-time is already set for recovery on Commn checkpoint changes
  if (recoveryPath === CHECKPOINT_TYPE.POINT_IN_TIME) {
    return validateCheckpointSelection(user, vms, dispatch);
  }
  return true;
}

export function changedVMRecoveryConfigurations(payload, user, dispatch) {
  const { values } = user;
  const { instanceDetails } = payload.drplan.recoveryEntities;
  const recoverVms = getValue('ui.site.recoveryEntities', values);
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  const res = checkChangesForArrayInObject(recoverVms, instanceDetails, recoveryPlatform, 'sourceMoref');
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
      || vm.recoveryStatus === RECOVERY_STATUS.MIGRATED || vm.recoveryStatus === RECOVERY_STATUS.RECOVERED
      || vm.recoveryStatus === RECOVERY_STATUS.MIGRATION_INIT) {
    return true;
  }
  return false;
}

export function validatedNewAndCnfmPass(user) {
  const { values, errors } = user;
  const password = getValue('user.newPassword', values);
  const cnfPassword = getValue('user.confirmPassword', values);
  // Added Below line to check if the new password and cnfirm new password fields has any error if it has then it should not call the change password api
  const passError = errors['user.newPassword'] || '';
  const cnfmError = errors['user.confirmPassword'] || '';
  if (password !== '' && cnfPassword !== '' && passError === '' && cnfmError === '' && password === cnfPassword) return true;
  return false;
}

export function validatePlanSiteSelection({ user, fieldKey, value }) {
  const { values } = user;
  const otherField = (fieldKey === 'drplan.protectedSite' ? 'drplan.recoverySite' : 'drplan.protectedSite');
  const otherFieldValue = getValue(otherField, values) || '';
  let res = '';
  if (`${otherFieldValue}` === `${value}` && otherFieldValue !== '' && value !== '') {
    res = i18n.t('error.same.site');
    return res;
  }
  return res;
}

export const showReverseWarningText = (user) => {
  const { values } = user;
  const enableReverse = getValue('drplan.enableDifferentialReverse', values) || '';
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values) || '';
  const protectionPlatform = getValue('ui.values.protectionPlatform', values) || '';
  const revReplType = getValue('reverse.replType', values) || '';
  const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values) || '';
  if (workflow === UI_WORKFLOW.REVERSE_PLAN && revReplType === STATIC_KEYS.DIFFERENTIAL && protectionPlatform === PLATFORM_TYPES.VMware) {
    return true;
  }
  if (enableReverse && recoveryPlatform === PLATFORM_TYPES.VMware) {
    return true;
  }
  return false;
};

/**
 *
 * @param {*} value
 * @param {*} user
 * @returns validates all the recovery checkpoint fields on pplan create and edit page
 */

export function validateCheckpointFields(value, user) {
  const { values } = user;
  const isRecoveryCheckpointConfgured = getValue(STORE_KEYS.RECOVERY_CHECKPOINTING_ENABLED, values);
  if (isRecoveryCheckpointConfgured) {
    return (isEmpty({ value }) || isEmptyNum({ value }));
  }
  return false;
}

/**
 *
 * @param {*} user
 * @returns if recovery checkpoint checkbox is diabled then disable all recovery checkpoint fields
 */
export function disableRecoveryCheckpointField(user) {
  const { values } = user;
  const disabled = getValue(STORE_KEYS.RECOVERY_CHECKPOINTING_ENABLED, values);
  return !disabled;
}

/**
 *
 * @param {*} user
 * @param {*} dispatch
 * @param {*} fields - recovery checkpoint field keys
 * @returns validate recovery checkpoint configuration on pplan create and edit wizard
 */
export function validateRecoveryCheckpointData(user, dispatch, fields) {
  const { values } = user;
  const isRecoveryCheckpointEnabled = getValue(STORE_KEYS.RECOVERY_CHECKPOINTING_ENABLED, values);
  const recoveryPointTimePeriod = getRecoveryPointTimePeriod(user, STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_NUM, STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_UNIT);
  const recoveryPointCopies = getValue(STORE_KEYS.RECOVERY_CHECKPOINT_COUNT, values);
  const replicationInterval = getReplicationInterval(getValue(STATIC_KEYS.REPLICATION_INTERVAL_TYPE, values), getValue('drplan.replicationInterval', values));
  const recoverySnapshot = (recoveryPointTimePeriod / recoveryPointCopies);
  const isCHeckpoiningPossible = recoverySnapshot % replicationInterval;
  if (validateSteps(user, dispatch, fields) && isRecoveryCheckpointEnabled) {
    if (isCHeckpoiningPossible === 0) {
      return true;
    }
    return false;
  }
  if (isRecoveryCheckpointEnabled) {
    return false;
  }
  return true;
}

export function checkPlanConfigurationChanges(prevPlan, currPlan) {
  return (dispatch) => {
    let arr = [{ title: i18n.t('label'), value: [i18n.t('previousVal'), i18n.t('updatedVal')] }];
    for (let i = 0; i < PLAN_KEYS.length; i += 1) {
      if (prevPlan[PLAN_KEYS[i]] !== currPlan[PLAN_KEYS[i]]) {
        const obj = { };
        if (PLAN_KEYS[i] === 'replicationInterval') {
          const prevInt = `Every ${convertMinutesToDaysHourFormat(prevPlan[PLAN_KEYS[i]])}`;
          const currInt = `Every ${convertMinutesToDaysHourFormat(currPlan[PLAN_KEYS[i]])}`;
          obj.title = PLAN_KEYS[i];
          obj.value = [prevInt, currInt];
          arr = [...arr, obj];
        } else {
          obj.title = PLAN_KEYS[i];
          obj.value = [prevPlan[PLAN_KEYS[i]], currPlan[PLAN_KEYS[i]]];
          arr = [...arr, obj];
        }
      }
    }
    if (arr.length > 1) {
      const resObj = [{ title: '', values: arr }];
      dispatch(valueChange('plan', resObj));
    }
  };
}

export function checkVmRecoveryConfigurationChanges({ prevArr, currentArr, recoveryPlatform, condition }) {
  return (dispatch) => {
    const obj = { changes: {}, add: {}, delete: {}, netadd: {}, netDelete: {} };
    const prevObjKey = Object.keys(prevArr);
    const currObjKey = Object.keys(currentArr);
    for (let i = 0; i < prevObjKey.length; i += 1) {
      if (currentArr[prevObjKey[i]]) {
        // check if the current data has previous vm
        const prev = prevArr[prevObjKey[i]];
        const curr = currentArr[prevObjKey[i]];
        let generalRes = [];
        generalRes = [{ title: i18n.t('label'), value: [i18n.t('previousVal'), i18n.t('updatedVal')] }, ...checkDiff(prev, curr, recoveryPlatform, 'GENERAL')];
        const netRes = checkNetworkDiff(prev.networks, curr.networks, recoveryPlatform);
        const netChanges = [...netRes.arr1];
        if (generalRes.length > 1) {
          obj.changes[`${prev[condition]}-name-${prev.instanceName}`] = [{ title: 'General', values: generalRes }];
        }
        if (netChanges.length > 0) {
          if (generalRes.length === 1) {
            obj.changes[`${prev[condition]}-name-${prev.instanceName}`] = [];
          }
          obj.changes[`${prev[condition]}-name-${prev.instanceName}`] = [...obj.changes[`${prev[condition]}-name-${prev.instanceName}`], ...netChanges];
        }
      } else {
        // if it doesn't have previous vm then add it in delete section
        obj.delete[prevObjKey[i]] = prevArr[prevObjKey[i]];
      }
    }

    for (let j = 0; j < currObjKey.length; j += 1) {
      // check if the updated data has added vm if yes add it in add section
      if (!prevArr[currObjKey[j]]) {
        const curr = currentArr[currObjKey[j]];
        let generalRes = [];
        generalRes = [{ title: 'Label', value: 'Values' }, ...checkDiff(curr, undefined, recoveryPlatform, 'GENERAL')];
        const netRes = checkNetworkDiff([], curr.networks, recoveryPlatform);
        const netChanges = [...netRes.arr1];
        if (generalRes.length > 1) {
          obj.add[`${curr[condition]}-name-${curr.instanceName}`] = [{ title: 'General', values: generalRes, name: curr.instanceName, add: true }];
        }
        if (netChanges.length > 0) {
          if (generalRes.length === 1) {
            obj.add[`${curr[condition]}-name-${curr.instanceName}`] = [];
          }
          obj.add[`${curr[condition]}-name-${curr.instanceName}`] = [...obj.add[`${curr[condition]}-name-${curr.instanceName}`], ...netChanges];
        }
      }
    }
    dispatch(valueChange(STATIC_KEYS.UI_PLAYBOOK_DIFF, obj));
  };
}

export function checkNetworkDiff(prevNet, currNet, recoveryPlatform) {
  const netAddDel = { add: [], delete: [], changes: [] };
  let arr1 = [];
  // if prev length is 0 or prevNet is not defined that means new vm added
  if (typeof prevNet === 'undefined' || prevNet.length === 0) {
    currNet.forEach((net, i) => {
      let resObj = [...checkDiff(net, undefined, recoveryPlatform, 'NETWORK')];
      if (resObj.length > 0) {
        resObj = [{ title: i18n.t('label'), value: [i18n.t('previousVal'), i18n.t('updatedVal')] }, ...resObj];
        arr1 = [...arr1, { title: `Nic- ${i + 1}`, values: resObj }];
      }
    });
    return { arr1 };
  }
  for (let i = 0; i < prevNet.length; i += 1) {
    const prev = prevNet[i];
    const curr = currNet[i];
    if (curr) {
      let resObj = [...checkDiff(prev, curr, recoveryPlatform, 'NETWORK')];
      if (resObj.length > 0) {
        resObj = [{ title: i18n.t('label'), value: [i18n.t('previousVal'), i18n.t('updatedVal')] }, ...resObj];
        arr1 = [...arr1, { title: `Nic- ${i + 1}`, values: resObj }];
      }
    }
  }
  if (currNet.length !== prevNet.length) {
    if (currNet.length > prevNet.length) {
      currNet.forEach((curr, ind) => {
        if (!prevNet[ind]) {
          let resObj = [...checkDiff(curr, undefined, recoveryPlatform, 'NETWORK')];
          if (resObj.length > 0) {
            resObj = [{ title: i18n.t('label'), value: i18n.t('Value') }, ...resObj];
            arr1 = [...arr1, { title: `Nic-${ind + 1}`, values: resObj, addData: true }];
          }
          netAddDel.add.push(curr);
        }
      });
    } else {
      prevNet.forEach((prev, ind) => {
        if (!currNet[ind]) {
          let resObj = [...checkDiff(prev, undefined, recoveryPlatform, 'NETWORK')];
          if (resObj.length > 0) {
            resObj = [{ title: i18n.t('label'), value: i18n.t('Value') }, ...resObj];
            arr1 = [...arr1, { title: `Nic-${ind + 1}`, values: resObj, deleteData: true }];
          }
          netAddDel.delete.push(prev);
        }
      });
    }
  }

  return { arr1 };
}

export function checkDiff(prevObj, currObj, recoveryPlatform, type) {
  const arr = [];
  let obj = {};
  let platformKeys = [];
  let keyObj;
  if (recoveryPlatform === PLATFORM_TYPES.AWS) {
    keyObj = GENERAL_PLATFORM_KEYS.AWS;
  } else if (recoveryPlatform === PLATFORM_TYPES.VMware) {
    keyObj = GENERAL_PLATFORM_KEYS.VMWARE;
  } else if (recoveryPlatform === PLATFORM_TYPES.Azure) {
    keyObj = GENERAL_PLATFORM_KEYS.AZURE;
  } else if (recoveryPlatform === PLATFORM_TYPES.GCP) {
    keyObj = GENERAL_PLATFORM_KEYS.GCP;
  }

  if (type === 'GENERAL') {
    platformKeys = keyObj.GENERAL;
  } else {
    platformKeys = keyObj.NETWORK;
  }

  for (let i = 0; i < platformKeys.length; i += 1) {
    const key = platformKeys[i];
    const prevVal = prevObj?.[key];
    if (!currObj) {
      obj.title = i18n.t(key) || key;
      obj.value = prevVal;
      arr.push(obj);
      obj = {};
    } else {
      const currVal = currObj[key];
      if (typeof prevVal === 'string') {
        if (prevVal.toLowerCase() !== currVal.toLowerCase()) {
          obj.title = i18n.t(key) || key;
          obj.value = [prevVal, currVal];
          arr.push(obj);
          obj = {};
        }
      } else if (typeof prevVal === 'object') {
        if (Object.keys(prevVal || []).length !== Object.keys(currVal || []).length) {
          obj.title = i18n.t(key) || key;
          if (key === 'tags') {
            let prevstr = '';
            let cuuStr = '';
            prevVal.forEach((v, ind) => {
              prevstr += `${ind !== 0 ? ', ' : ''}${v.key}-${v.value}`;
            });
            currVal.forEach((v, ind) => {
              cuuStr += `${ind !== 0 ? ', ' : ''}${v.key}-${v.value}`;
            });
            obj.value = [prevstr, cuuStr];
          }
          arr.push(obj);
          obj = {};
        }
      } else if (prevVal !== currVal) {
        obj.title = i18n.t(key) || key;
        obj.value = [prevVal, currVal];
        arr.push(obj);
        obj = {};
      }
    }
  }
  return arr;
}

export function validateConfigureIDP(user, dispatch) {
  const { values } = user;
  const fields = Object.keys(FIELDS).filter((key) => key.indexOf('configureIDP') !== -1);
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

/**
 * Validate if user select unique checkpoin then all the selected VMs have that checkpoint selected
 * @param {*} user
 * @param {*} vms
 * @param {*} dispatch
 * @returns
 */

export function validateCheckpointSelection(user, vms, dispatch) {
  const { values } = user;
  let checkpointFlag = false;
  const checkpointRequiredVM = [];
  const selectedVMs = Object.keys(vms);
  for (let i = 0; i < selectedVMs.length; i += 1) {
    const vm = selectedVMs[i];
    const checkpoint = getValue(`${vm}-recovery-checkpoint`, values);
    if (typeof checkpoint.value === 'undefined' || checkpoint.value === '') {
      const field = FIELDS['ui.vm.recovery.checkpoints'];
      const { shouldShow } = field;
      const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
      if (showField) {
        validateField(field, `${vm}-recovery-checkpoint`, getValue(`${vm}-recovery-checkpoint`, values), dispatch, user);
      }
      checkpointRequiredVM.push(vms[vm].name);
      dispatch(addMessage(`Please select point in time checkpoint for ${checkpointRequiredVM.join(', ')}`, MESSAGE_TYPES.ERROR));
      checkpointFlag = true;
    }
  }

  return !checkpointFlag;
}
