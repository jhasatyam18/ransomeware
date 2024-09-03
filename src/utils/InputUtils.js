import { t } from 'i18next';
import { API_FETCH_VMWARE_LOCATION } from '../constants/ApiConstants';
import { JOB_INIT_FAILED, JOB_INIT_SYNC_FAILED, NODE_STATUS_ONLINE } from '../constants/AppStatus';
import { FIELDS, FIELD_TYPE } from '../constants/FieldsConstant';
import { EMAIL, EXCLUDE_KEYS_CONSTANTS, EXCLUDE_KEYS_RECOVERY_CONFIGURATION, PLATFORM_TYPES, RECOVERY_STATUS, REVERSE_ENTITY_TYPE, SCRIPT_TYPE, STATIC_KEYS, SUPPORTED_FIRMWARE, SUPPORTED_GUEST_OS, UI_WORKFLOW, VMWARE_OS_DISK_DEVICE_KEYS } from '../constants/InputConstants';
import { STACK_COMPONENT_LOCATION, STACK_COMPONENT_MEMORY, STACK_COMPONENT_NETWORK, STACK_COMPONENT_SECURITY_GROUP, STACK_COMPONENT_TAGS } from '../constants/StackConstants';
import { STORE_KEYS } from '../constants/StoreKeyConstants';
import { MAC_ADDRESS } from '../constants/ValidationConstants';
import { getStorageForVMware, onScriptChange, valueChange } from '../store/actions';
import { onAwsStorageTypeChange } from '../store/actions/AwsActions';
import { recoveryConfigOnCheckpointChanges } from '../store/actions/checkpointActions';
import { getLabelWithResourceGrp } from './AppUtils';
import { getAwsHostAffinityOptions, getAwsHostMorefLabel, getAwsTenancyOptionBy, getAwsTenancyOptions, showHostByIdOrArnErrorMessage, showTenancyOptions, validateAWSHostMoref } from './AwsUtils';
import { isEmpty, isMemoryValueValid } from './validationUtils';

export function getValue(key, values) {
  const ret = values[key];
  return typeof ret === 'undefined' ? getDefaultValueForType(key) : ret;
}

export function getDefaultValueForType(key) {
  try {
    const type = FIELDS && FIELDS[key].type;
    if (type) {
      switch (type) {
        case FIELD_TYPE.CHECKBOX: return false;
        case FIELD_TYPE.NUMBER: return 0;
        case FIELD_TYPE.SELECT: return null;
        default:
          return '';
      }
    }
  } catch (error) {
    return '';
  }
}

export function isPlatformTypeVMware(user) {
  const { values } = user;
  if (getValue('configureSite.platformDetails.platformType', values) === PLATFORM_TYPES.VMware) {
    return true;
  }
  return false;
}

export function isPlatformTypeAWS(user) {
  const { values } = user;
  if (getValue('configureSite.platformDetails.platformType', values) === PLATFORM_TYPES.AWS) {
    return true;
  }
  return false;
}
export function isPlatformTypeGCP(user) {
  const { values } = user;
  if (getValue('configureSite.platformDetails.platformType', values) === PLATFORM_TYPES.GCP) {
    return true;
  }
  return false;
}
export function isPlatformTypeAzure(user) {
  const { values } = user;
  if (getValue('configureSite.platformDetails.platformType', values) === PLATFORM_TYPES.Azure) {
    return true;
  }
  return false;
}

export function showDifferentialReverseCheckbox(user) {
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values) || '';
  if (recoveryPlatform !== '' && recoveryPlatform === PLATFORM_TYPES.GCP) {
    return false;
  }
  return true;
}

export function getSitesOptions(user, fieldKey) {
  const { values } = user;
  const sites = getValue(STATIC_KEYS.UI_SITES, values);
  const result = [];
  if (sites) {
    sites.reduce((previous, next) => {
      const { node } = next;
      const { isLocalNode } = node;
      if (fieldKey.indexOf('protectedSite') !== -1 && isLocalNode) {
        previous.push({ label: next.name, value: next.id });
      } else if (fieldKey.indexOf('recoverySite') !== -1 && !isLocalNode) {
        previous.push({ label: next.name, value: next.id });
      }
      return previous;
    }, result);
  }
  return result;
}

export function getDefaultRecoverySite(user) {
  const { values } = user;
  const drPlan = getValue('ui.reverse.drPlan', values);
  return drPlan.recoverySite.id;
}

export function getDRPlanOptions(user) {
  const { values } = user;
  const plans = getValue(STATIC_KEYS.UI_PROTECTION_PLANS, values);
  const result = [];
  if (plans) {
    plans.reduce((previous, next) => {
      previous.push({ label: next.name, value: next.id });
      return previous;
    }, result);
  }
  return result;
}

export function getInstanceTypeOptions(user) {
  const { values } = user;
  const instanceTypes = getValue(STATIC_KEYS.UI_INSTANCES, values);
  const result = [];
  if (instanceTypes) {
    instanceTypes.reduce((previous, next) => {
      previous.push({ label: next.label, value: next.value });
      return previous;
    }, result);
  }
  return result;
}

export function getEncryptionKeyOptions(user) {
  const { values } = user;
  const keys = getValue(STATIC_KEYS.UI_ENCRYPTION_KEYS, values);
  const result = [];
  if (keys) {
    keys.reduce((previous, next) => {
      previous.push({ label: next.label, value: next.value });
      return previous;
    }, result);
  }
  return result;
}

export function getResourceTypeOptions(user) {
  const { values } = user;
  const resourceTypeOpt = getValue(STATIC_KEYS.RESOURCE_GROUP, values) || [];
  const array = [];
  resourceTypeOpt.map((res) => {
    const obj = {};
    obj.label = res.name;
    obj.value = res.value;
    array.push(obj);
  });
  return array;
}

export function getAvailibilityZoneOptions(user) {
  const { values } = user;
  const zones = getValue(STATIC_KEYS.UI_AVAILABILITY_ZONES, values);
  const result = [];
  if (zones) {
    zones.reduce((previous, next) => {
      previous.push({ label: next.label, value: next.value });
      return previous;
    }, result);
  }
  return result;
}

export function getRegionOptions(user) {
  const { values } = user;
  const zones = getValue(STATIC_KEYS.UI_REGIONS, values);
  const result = [];
  if (zones) {
    zones.reduce((previous, next) => {
      previous.push({ label: next.label, value: next.value });
      return previous;
    }, result);
  }
  return result;
}

export function getScripts(type, user) {
  const key = (type === SCRIPT_TYPE.PRE ? STATIC_KEYS.UI_SCRIPT_PRE : STATIC_KEYS.UI_SCRIPT_POST);
  const opts = optionsBuilder(user, key);
  opts.splice(0, 0, { label: '+ Upload New Script', value: '+NEW_SCRIPT' });
  return opts;
}

export function getPreScriptsOptions(user) {
  return getScripts(SCRIPT_TYPE.PRE, user);
}

export function getPostScriptsOptions(user) {
  return getScripts(SCRIPT_TYPE.POST, user);
}

export function geBootPriorityOptions() {
  return [{ label: '1 (Highest)', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5 (Lowest)', value: 5 }];
}

export function getStorageTypeOptions(user) {
  const { values } = user;
  const data = getValue(STATIC_KEYS.UI_VOLUMETYPES, values);
  return data;
}

// generate options from plain array ["d1","d2"]
export function optionsBuilder(user, key) {
  const { values } = user;
  const opts = getValue(key, values) || [];
  const options = [];
  opts.forEach((op) => {
    options.push({ label: op, value: op });
  });
  return options;
}

export function getSecurityGroupOption(user, fieldKey) {
  const { values } = user;
  let isCopyConfiguration = false;
  if (fieldKey && isPlanWithSamePlatform(user)) {
    isCopyConfiguration = isAWSCopyNic(fieldKey, '-securityGroups', user);
  }
  const dataSourceKey = (isCopyConfiguration === true ? STATIC_KEYS.UI_SECURITY_GROUPS_SOURCE : STATIC_KEYS.UI_SECURITY_GROUPS);
  const opts = getValue(dataSourceKey, values) || [];
  const networkID = getValue(fieldKey.replace('-securityGroups', '-vpcId'), values);
  const options = [];
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  opts.forEach((op) => {
    const name = (op.name && op.name !== '' ? op.name : op.id);
    if (op.vpcID === networkID || recoveryPlatform === PLATFORM_TYPES.GCP) {
      options.push({ label: name, value: op.id });
    }
  });
  return options || [];
}

export function getAzureSecurityGroupOption(user) {
  const { values } = user;
  const opts = getValue(STATIC_KEYS.UI_SECURITY_GROUPS, values) || [];
  const options = [];
  opts.forEach((op) => {
    const { name } = op;
    if (typeof name !== 'undefined' && name !== '') {
      const label = getLabelWithResourceGrp(name);
      options.push({ label, value: op.name });
    }
  });
  return options || [];
}

export function getSubnetOptions(user, fieldKey) {
  const { values } = user;
  let isCopyConfiguration = false;
  if (fieldKey && isPlanWithSamePlatform(user)) {
    isCopyConfiguration = isAWSCopyNic(fieldKey, '-subnet', user);
  }
  const dataSourceKey = (isCopyConfiguration === true ? STATIC_KEYS.UI_SUBNETS__SOURCE : STATIC_KEYS.UI_SUBNETS);
  const opts = getValue(dataSourceKey, values) || [];
  const networkID = getValue(fieldKey.replace('-subnet', '-vpcId'), values);
  const options = [];
  const sourceSubnet = getValue(fieldKey, values);
  opts.forEach((op) => {
    const name = getSubnetLabel(op);
    if (isCopyConfiguration && op.id === sourceSubnet) {
      options.push({ label: name, value: op.id });
    }
    if (op.vpcID === networkID && !isCopyConfiguration) {
      options.push({ label: name, value: op.id });
    }
  });
  return options;
}

export function getGCPSubnetOptions(user, fieldKey) {
  const { values } = user;
  const opts = getValue(STATIC_KEYS.UI_SUBNETS, values) || [];
  const networkFieldKey = fieldKey.replace('-subnet', '-network');
  const netID = getValue(networkFieldKey, values);
  const options = [];
  opts.forEach((op) => {
    if (netID === op.vpcID) {
      const name = getSubnetLabel(op);
      options.push({ label: name, value: op.id });
    }
  });
  return options;
}

export function getAzureSubnetOptions(user, fieldKey) {
  const { values } = user;
  const opts = getValue(STATIC_KEYS.UI_SUBNETS, values) || [];
  const networkFieldKey = fieldKey.replace('-subnet', '-network');
  let netID = getValue(networkFieldKey, values) || '';
  if (typeof netID === 'object') {
    netID = netID.value;
  }
  const options = [];
  opts.forEach((op) => {
    const { vpcID, name, cidr } = op;
    if (typeof vpcID !== 'undefined' && netID === vpcID && typeof name !== 'undefined' && name !== '') {
      let label = '';
      const nameArr = name.split(':');
      if (nameArr.length === 2) {
        const resource = nameArr[0];
        const subnetName = nameArr[1];
        label = `${subnetName}-${cidr} (${resource})`;
      } else {
        [label] = name;
      }
      options.push({ label, value: op.id });
    }
  });
  return options;
}

export function getNetworkOptions(user) {
  const { values } = user;
  const opts = getValue(STATIC_KEYS.UI_SUBNETS, values) || [];
  const options = [];
  opts.forEach((op) => {
    const network = op.vpcID;
    const name = network.split(/[\s/]+/).pop();
    const exist = options.find((item) => item.label === name);
    if (!exist) {
      options.push({ label: name, value: op.vpcID });
    }
  });
  return options;
}

export function getAzureNetworkOptions(user) {
  const { values } = user;
  const opts = getValue(STATIC_KEYS.UI_NETWORKS, values) || [];
  const options = [];
  opts.forEach((op) => {
    const { name } = op;
    let label = '';
    if (typeof name !== 'undefined' && name !== '') {
      label = getLabelWithResourceGrp(name);
      const exist = options.find((item) => item.label === name);
      if (!exist) {
        options.push({ label, value: op.id });
      }
    }
  });
  return options;
}

export function getGCPExternalIPOptions(user) {
  const { values } = user;
  const options = [];
  options.push({ label: 'None', value: 'None' });
  options.push({ label: 'Auto', value: 'Ephemeral' });
  const ips = getValue(STATIC_KEYS.UI_RESERVE_IPS, values) || [];
  ips.forEach((op) => {
    if (op.ipType === 'EXTERNAL') {
      options.push({ label: op.name, value: op.name });
    }
  });
  return options;
}

export function getAzureExternalIPOptions(user, fieldKey) {
  const { values } = user;
  const options = [];
  options.push({ label: 'None', value: false });
  options.push({ label: 'Auto', value: true });
  const ips = getValue(STATIC_KEYS.UI_RESERVE_IPS, values) || [];
  ips.forEach((op) => {
    const { name } = op;
    const ipLabel = getLabelWithResourceGrp(name);
    options.push({ label: ipLabel, value: op.name.toLowerCase() });
  });
  if (typeof fieldKey !== 'undefined' && fieldKey !== null && fieldKey !== '' && fieldKey !== '-') {
    const networkKey = fieldKey.replace('-publicIP', '');
    const publicIP = getValue(fieldKey, values);
    const associatedIPs = getValue(STATIC_KEYS.UI_ASSOCIATED_RESERVE_IPS, values) || {};
    const keys = Object.keys(associatedIPs);
    if (keys.length > 0) {
      const vmIps = keys.filter((k) => associatedIPs[k].fieldKey === networkKey && associatedIPs[k].value === publicIP);
      if (vmIps.length > 0) {
        vmIps.forEach((op) => {
          options.push({ label: associatedIPs[op].label, value: associatedIPs[op].value });
        });
      }
    }
  }
  return options;
}

export function getAWSElasticIPOptions(user, fieldKey) {
  const { values } = user;
  const options = [];
  const ips = getValue(STATIC_KEYS.UI_RESERVE_IPS, values) || [];
  ips.forEach((op) => {
    options.push({ label: op.name, value: op.id });
  });
  // const fieldValue = getValue(fieldKey, values);
  if (typeof fieldKey !== 'undefined' && fieldKey !== null && fieldKey !== '' && fieldKey !== '-') {
    const networkKey = fieldKey.replace('-network', '');
    const associatedIPs = getValue(STATIC_KEYS.UI_ASSOCIATED_RESERVE_IPS, values) || {};
    const keys = Object.keys(associatedIPs);
    if (keys.length > 0) {
      const vmIps = keys.filter((k) => associatedIPs[k].fieldKey === networkKey);
      if (vmIps.length > 0) {
        vmIps.forEach((op) => {
          options.push({ label: associatedIPs[op].label, value: associatedIPs[op].value });
        });
      }
    }
  }
  const filteredOptions = [];
  options.forEach((op) => {
    const ops = filteredOptions.filter((o) => o.value === op.value);
    if (ops.length === 0) {
      filteredOptions.push(op);
    }
  });
  return filteredOptions;
}

export function getGCPNetworkTierOptions() {
  const options = [];
  options.push({ label: 'Standard', value: 'Standard' });
  options.push({ label: 'Premium', value: 'Premium' });
  return options;
}

function getSubnetLabel(subnet) {
  if (subnet.cidr && subnet.cidr !== '') {
    return `${subnet.cidr} - ${subnet.id}`;
  }
  if (subnet.name && subnet.name !== '') {
    return `${subnet.name} - ${subnet.id}`;
  }
  return subnet.id;
}

export function buildRangeOptions(start, end, label) {
  const options = [];
  let postFix = '';
  if (label) {
    postFix = label;
  }
  for (let i = start; i <= end; i += 1) {
    const option = { label: `${i} ${postFix}`, value: i };
    options.push(option);
  }
  return options;
}
export function getReplicationIntervalOptions(user) {
  const { values } = user;
  const intervalType = getValue(STATIC_KEYS.REPLICATION_INTERVAL_TYPE, values);
  switch (intervalType) {
    case STATIC_KEYS.REPLICATION_INTERVAL_TYPE_DAY:
      return buildRangeOptions(1, 10);
    case STATIC_KEYS.REPLICATION_INTERVAL_TYPE_HOUR:
      return buildRangeOptions(1, 23);
    default:
      return buildRangeOptions(10, 59);
  }
}

export function createVMConfigStackObject(vm, user) {
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  switch (recoveryPlatform) {
    case PLATFORM_TYPES.GCP:
      return getGCPVMConfig(vm);
    case PLATFORM_TYPES.VMware:
      return getVMwareVMConfig(vm);
    case PLATFORM_TYPES.AWS:
      return getAwsVMConfig(vm);
    case PLATFORM_TYPES.Azure:
      return getAzureVMConfig(vm);
    default:
      return { data: [] };
  }
}

export function getGCPVMConfig(vm) {
  const key = (typeof vm === 'string' ? vm : vm.moref);
  const config = {
    data: [
      {
        hasChildren: true,
        title: 'General',
        children: {
          [`${key}-vmConfig.general.guestOS`]: { label: 'GuestOS Family', fieldInfo: 'info.protectionplan.resource.guest.os', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select guest operating system', shouldShow: true, options: (u) => getSupportedOSTypes(u) },
          [`${key}-vmConfig.general.firmwareType`]: { label: 'Firmware Type', fieldInfo: 'info.protectionplan.resource.firmware', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select Firmware Type', shouldShow: true, options: (u) => getFirmwareTypes(u) },
          [`${key}-vmConfig.general.instanceType`]: { label: 'Instance Type', fieldInfo: 'info.protectionplan.instance.type', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
          [`${key}-vmConfig.general.volumeType`]: { label: 'Volume Type', fieldInfo: 'info.protectionplan.volume.type.gcp', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select volume type.', shouldShow: true, options: (u) => getStorageTypeOptions(u), disabled: (u, f) => shouldDisableStorageType(u, f) },
          // [`${key}-vmConfig.general.bootOrder`]: { label: 'Boot Order', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select boot order.', shouldShow: true, options: (u) => geBootPriorityOptions(u) },
          [`${key}-vmConfig.general.tags`]: { label: 'Metadata', fieldInfo: 'info.protectionplan.instance.tags.gcp', type: STACK_COMPONENT_TAGS, validate: null, errorMessage: '', shouldShow: true },
        },
      },
      {
        hasChildren: true,
        title: 'Network',
        children: {
          [`${key}-vmConfig.network.net1`]: { label: 'IP Address', fieldInfo: 'info.protectionplan.instance.network.gcp', type: STACK_COMPONENT_NETWORK, validate: null, errorMessage: '', shouldShow: true, options: (u) => getInstanceTypeOptions(u), data: vm },
          [`${key}-vmConfig.network.securityGroup`]: { label: 'Network Tags', type: STACK_COMPONENT_SECURITY_GROUP, validate: null, errorMessage: '', shouldShow: true, fieldInfo: 'info.protectionplan.instance.network.tags' },
        },
      },
      ...getReplicationScript(key),
      ...getRecoveryScript(key),
    ],
  };
  return config;
}

export function getAwsVMConfig(vm) {
  const key = (typeof vm === 'string' ? vm : vm.moref);
  const config = {
    data: [
      {
        hasChildren: true,
        title: 'General',
        children: {
          [`${key}-vmConfig.general.guestOS`]: { label: 'GuestOS Family', fieldInfo: 'info.protectionplan.resource.guest.os', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select guest operating system', shouldShow: true, options: (u) => getSupportedOSTypes(u) },
          [`${key}-vmConfig.general.firmwareType`]: { label: 'Firmware Type', fieldInfo: 'info.protectionplan.resource.firmware', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select Firmware type', shouldShow: true, options: (u) => getFirmwareTypes(u) },
          // Tenancy fields
          [`${key}-vmConfig.general.tenancy`]: { label: 'Tenancy', fieldInfo: 'info.protectionplan.aws.tenancy', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select tenancy type', shouldShow: true, options: (u) => getAwsTenancyOptions(u), defaultValue: 'default' },
          [`${key}-vmConfig.general.hostType`]: { label: 'Target host by', fieldInfo: 'info.protectionplan.aws.tenancyBy', type: FIELD_TYPE.SELECT, validate: null, errorMessage: 'Select target host by type', shouldShow: (u, f) => showTenancyOptions(u, f), options: (u) => getAwsTenancyOptionBy(u), hideComponent: (u, f) => showTenancyOptions(u, f), defaultValue: '' },
          [`${key}-vmConfig.general.hostMoref`]: { label: (u, f) => getAwsHostMorefLabel(u, f), fieldInfo: 'info.protectionplan.aws.host.arn', type: FIELD_TYPE.TEXT, validate: (value, user) => validateAWSHostMoref(value, user), errorMessage: 'Enter id or arn', errorFunction: ({ user, fieldKey }) => showHostByIdOrArnErrorMessage({ user, fieldKey }), shouldShow: (u, f) => showTenancyOptions(u, f), hideComponent: (u, f) => showTenancyOptions(u, f) },
          [`${key}-vmConfig.general.affinity`]: { label: 'Target Affinity', fieldInfo: 'info.protectionplan.aws.host.affinity', type: FIELD_TYPE.SELECT, defaultValue: '', errorMessage: 'Select Affinity', shouldShow: (u, f) => showTenancyOptions(u, f), hideComponent: (u, f) => showTenancyOptions(u, f), options: (u, f) => getAwsHostAffinityOptions(u, f) },
          [`${key}-vmConfig.general.image`]: { label: 'Associated AMI', fieldInfo: 'info.protectionplan.aws.ami', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Enter associated AMI', shouldShow: (u, f) => showTenancyOptions(u, f), hideComponent: (u, f) => showTenancyOptions(u, f) },
          [`${key}-vmConfig.general.license`]: { label: 'License Manager', fieldInfo: 'info.protectionplan.aws.license', type: FIELD_TYPE.TEXT, shouldShow: (u, f) => showTenancyOptions(u, f), hideComponent: (u, f) => showTenancyOptions(u, f) },
          // Tenancy Field end
          [`${key}-vmConfig.general.instanceType`]: { label: 'Instance Type', fieldInfo: 'info.protectionplan.instance.type', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
          [`${key}-vmConfig.general.volumeType`]: { label: 'Volume Type', fieldInfo: 'info.protectionplan.instance.volume.type.aws', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select volume type.', shouldShow: true, options: (u) => getStorageTypeOptions(u), onChange: (user, dispatch) => onAwsStorageTypeChange(user, dispatch), disabled: (u, f) => shouldDisableStorageType(u, f) },
          [`${key}-vmConfig.general.volumeIOPS`]: { label: 'Volume IOPS', fieldInfo: 'info.protectionplan.instance.volume.iops.aws', type: FIELD_TYPE.NUMBER, errorMessage: 'Provide volume IOPS.', disabled: (u, f) => shouldEnableAWSIOPS(u, f), min: 0 },
          [`${key}-vmConfig.general.encryptionKey`]: { label: 'Encryption KMS Key', fieldInfo: 'info.protectionplan.instance.volume.encrypt', type: FIELD_TYPE.SELECT, errorMessage: '', disabled: (u, f) => shouldEnableAWSEncryption(u, f), validate: null, options: (u) => getEncryptionKeyOptions(u), shouldShow: (user) => shouldShowAWSKMS(user) },
          [`${key}-vmConfig.general.tags`]: { label: 'Tags', fieldInfo: 'info.protectionplan.instance.tags.aws', type: STACK_COMPONENT_TAGS, validate: null, errorMessage: '', shouldShow: true },
        },
      },
      {
        hasChildren: true,
        title: 'Network',
        children: {
          [`${key}-vmConfig.network.net1`]: { label: 'IP Address', fieldInfo: 'info.protectionplan.instance.network.aws', type: STACK_COMPONENT_NETWORK, validate: null, errorMessage: '', shouldShow: true, options: (u) => getInstanceTypeOptions(u), data: vm },
        },
      },
      ...getReplicationScript(key),
      ...getRecoveryScript(key),
    ],
  };
  return config;
}

export function getVMwareVMConfig(vm) {
  const key = (typeof vm === 'string' ? vm : vm.moref);
  const config = {
    data: [
      ...getVMwareGeneralSettings(key, vm),
      ...getReplicationScript(key),
      ...getRecoveryScript(key),
    ],
  };
  return config;
}

export function getAzureVMConfig(vm) {
  const key = (typeof vm === 'string' ? vm : vm.moref);
  const config = {
    data: [
      ...getAzureGeneralSettings(key, vm),
      ...getReplicationScript(key),
      ...getRecoveryScript(key),
    ],
  };
  return config;
}
export function getNodeTypeOptions() {
  return [
    { label: 'Management', value: 'Management' },
    { label: 'Replication', value: 'Replication' },
    { label: 'Prep Node', value: 'PrepNode' },
    { label: 'Dedupe Server', value: 'DedupeServer' },
  ];
}

export function getPlatformTypeOptions() {
  return [
    { label: 'VMware', value: 'VMware' },
    { label: 'AWS', value: 'AWS' },
    { label: 'GCP', value: 'GCP' },
    { label: 'Azure', value: 'Azure' },
  ];
}

export function getSiteNodeOptions(user) {
  const { values } = user;
  let nodes = getValue(STATIC_KEYS.UI_SITE_NODES, values);
  const platfomrType = getValue('configureSite.platformDetails.platformType', values);
  if (nodes === '' || nodes === null || platfomrType === '') {
    return [];
  }
  nodes = nodes.filter((node) => node.status === NODE_STATUS_ONLINE).filter((oNode) => oNode.platformType === platfomrType && oNode.nodeType === 'Management');
  const result = [];
  if (nodes) {
    nodes.reduce((previous, next) => {
      previous.push({ label: (next.hostname ? `${next.name} (${next.hostname})` : next.name), value: next.id });
      return previous;
    }, result);
  }
  return result;
}

export function shouldShowNodePlatformType(user) {
  const { values } = user;
  const nodeType = getValue('node.nodeType', values);
  if (nodeType === 'Management' || nodeType === 'Replication') {
    return true;
  }
  return false;
}

export function shouldShowNodeManagementPort(user) {
  const { values } = user;
  const nodeType = getValue('node.nodeType', values);
  if (nodeType === 'Management' || nodeType === 'DedupeServer') {
    return true;
  }
  return false;
}

export function shouldShowNodeReplicationPort(user) {
  const { values } = user;
  const nodeType = getValue('node.nodeType', values);
  if (nodeType === 'Management' || nodeType === 'Replication') {
    return true;
  }
  return false;
}

export function getEventOptions() {
  return [
    { label: 'Recovery', value: 'Recovery' },
    { label: 'Migration', value: 'Migration' },
    { label: 'Replication', value: 'Replication' },
    { label: 'License', value: 'License' },
    { label: 'ProtectionPlan', value: 'ProtectionPlan' },
    { label: 'Site', value: 'Site' },
    { label: 'Node', value: 'Node' },
    { label: 'Credential', value: 'Credential' },
    { label: 'Monitoring', value: 'Monitoring' },
    { label: 'Changed Block Tracking', value: 'ChangedBlockTracking' },
  ];
}

export function getReplicationUnitDays() {
  const range = buildRangeOptions(2, 30, 'Days');
  return [{ label: 'Day', value: 0 }, { label: '1 Day', value: 1 }, ...range];
}

export function getReplicationUnitHours() {
  const range = buildRangeOptions(2, 23, 'Hours');
  return [{ label: 'Hours', value: 0 }, { label: '1 Hour', value: 1 }, ...range];
}

export function getReplicationUnitMins() {
  const range = buildRangeOptions(2, 59, 'minutes');
  return [{ label: 'Minutes', value: 0 }, { label: '1 minute', value: 1 }, ...range];
}

export function getReportTypeOptions() {
  return [
    { label: 'Protection Plan', value: 'pp', name: 'rpt-group' },
    { label: 'Over all', value: 'overall', name: 'rpt-group' },
  ];
}

export function getReportProtectionPlans(user) {
  const result = [{ label: 'All', value: 0 }];
  return [...result, ...getDRPlanOptions(user)];
}

export function getNetInfo(networkKey, index, values) {
  const isPublicIP = getValue(`${networkKey}-eth-${index}-isPublic`, values) || false;
  const subnet = getValue(`${networkKey}-eth-${index}-subnet`, values) || '';
  const privateIP = getValue(`${networkKey}-eth-${index}-privateIP`, values) || '-';
  const publicIP = getValue(`${networkKey}-eth-${index}-publicIP`, values) || '';
  const network = getValue(`${networkKey}-eth-${index}-network`, values) || '';
  return { hasPublicIP: (isPublicIP ? 'Yes' : 'No'), subnet, privateIP, isPublicIP, publicIP, network };
}

export function shouldShowBandwidthConfig(user) {
  const { values } = user;
  const limit = getValue('throttling.bandwidthLimit', values);
  if (limit === true) {
    return true;
  }
  return false;
}

export function shouldEnableAWSIOPS(user, fieldKey) {
  const { values } = user;
  const keys = fieldKey.split('.volumeIOPS');
  const iopsKey = `${keys[0]}.volumeType`;
  const storageType = getValue(iopsKey, values);
  if (storageType === 'gp2') {
    return true;
  }
  if (isVMAlertAction(user)) {
    return true;
  }
  return false;
}

export function shouldShowAWSKMS(user) {
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  return recoveryPlatform === PLATFORM_TYPES.AWS;
}

export function shouldEnableAWSEncryption(user, fieldKey) {
  const { values } = user;
  const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  if (workflow === UI_WORKFLOW.REVERSE_PLAN) {
    return false;
  }
  const keys = fieldKey.split('-vmConfig.general.encryptionKey');
  const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  // get the replication job fetch from pplan id from the store
  const replJobs = getValue(STATIC_KEYS.UI_REPLICATIONJOBS_BY_PPLAN_ID, values);
  let disabled = false;
  if (keys.length > 1) {
    // get the vm moref in vmID
    const vmID = keys[0];
    if (typeof selectedVMs[vmID] !== 'undefined') {
      if (selectedVMs[vmID].id !== '') {
        disabled = true;
      }
      if (replJobs.length > 0) {
        for (let i = 0; i < replJobs.length; i += 1) {
          const repl = replJobs[i];
          if (selectedVMs[vmID].moref === repl.vmMoref) {
            // if sync status is init-failed or init-resyc-failed and transferredSize is zero then only enable encryption option
            if (repl.syncStatus === JOB_INIT_FAILED || (repl.syncStatus === JOB_INIT_SYNC_FAILED && repl.transferredSize === 0)) {
              disabled = false;
            }
            break;
          }
        }
      }
    } else {
      disabled = true;
    }
  }
  return disabled;
}

export function getAWSNetworkIDFromName(values, name) {
  const ips = getValue(STATIC_KEYS.UI_RESERVE_IPS, values) || [];
  const associatedIPs = getValue(STATIC_KEYS.UI_ASSOCIATED_RESERVE_IPS, values) || {};
  let ipName = '';
  ips.forEach((op) => {
    if (op.id === name) {
      ipName = op.name;
    }
  });
  // check for the associated ips records if record not found in free ips
  if (ipName === '') {
    Object.keys(associatedIPs).forEach((op) => {
      if (associatedIPs[op].value === name) {
        ipName = associatedIPs[op].label;
      }
    });
  }
  return ipName;
}

export function getVMMorefFromEvent(event) {
  let vmMoref = '';
  if (event !== null && event.impactedObjectURNs !== '') {
    const parts = event.impactedObjectURNs.split(',');
    if (parts.length > 1) {
      const urn = parts[parts.length - 1].split(':');
      if (urn.length >= 2) {
        vmMoref = `${urn[urn.length - 2]}:${urn[urn.length - 1]}`;
      }
    }
  }
  return vmMoref;
}

export function getVMInstanceFromEvent(event) {
  let vmMoref = '';
  if (event !== null && event.impactedObjectURNs !== '') {
    const parts = event.impactedObjectURNs.split(',');
    if (parts.length > 0) {
      for (let i = 0; i < parts.length; i += 1) {
        const part = parts[i].split(':');
        if (part[0] === 'Virtualmachine') {
          vmMoref = part[part.length - 1];
        }
      }
    }
  }
  return vmMoref;
}

export function isVMAlertAction(user) {
  const { values } = user;
  const isAlertAction = getValue('ui.vm.isVMAlertAction', values);
  if (typeof isAlertAction !== 'undefined' && isAlertAction === true) {
    return true;
  }
  return false;
}

export function shouldDisableStorageType(user) {
  return isVMAlertAction(user);
}

export function getSourceVMTags(vmKeyTag, values) {
  const vms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const vmKey = vmKeyTag.replace('-vmConfig.general.tags', '');
  const vmObj = vms[vmKey];
  if (vmObj && vmObj.tags) {
    return vmObj.tags;
  }
  return [];
}

export function isPlanWithSamePlatform(user) {
  const { values } = user;
  const protectionPlatform = getValue('ui.values.protectionPlatform', values);
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  return recoveryPlatform === protectionPlatform;
}

export function isSamePlatformPlan(selectedPlan) {
  return selectedPlan.protectedSite.platformDetails.platformType === selectedPlan.recoverySite.platformDetails.platformType;
}

export function isAWSCopyNic(fieldKey, replaceKey, user) {
  const { values } = user;
  let isCopyConfiguration = false;
  if (fieldKey && isPlanWithSamePlatform(user)) {
    const cpyKey = fieldKey.replace(replaceKey, '-isFromSource');
    isCopyConfiguration = getValue(cpyKey, values);
  }
  if (typeof isCopyConfiguration !== 'boolean') {
    isCopyConfiguration = false;
  }
  return isCopyConfiguration;
}

export function getVPCOptions(user) {
  const { values } = user;
  const opts = getValue(STATIC_KEYS.UI_VPC_TARGET, values) || [];
  const options = [];
  opts.forEach((op) => {
    options.push({ label: op.cidr, value: op.id });
  });
  return options;
}

export function excludeKeys(key, recoveryPlatform) {
  if (recoveryPlatform === PLATFORM_TYPES.GCP && key === EXCLUDE_KEYS_CONSTANTS.AVAILABILITY_ZONES) {
    return false;
  }
  const excludeKey = Object.keys(EXCLUDE_KEYS_CONSTANTS);
  if (PLATFORM_TYPES.AWS === recoveryPlatform || PLATFORM_TYPES.GCP === recoveryPlatform) {
    for (let i = 1; i < excludeKey.length; i += 1) {
      if (key === EXCLUDE_KEYS_CONSTANTS[excludeKey[i]]) {
        return false;
      }
    }
  }
  const keys = Object.keys(EXCLUDE_KEYS_RECOVERY_CONFIGURATION);
  for (let i = 0; i < keys.length; i += 1) {
    if (EXCLUDE_KEYS_RECOVERY_CONFIGURATION[keys[i]] === key) {
      return false;
    }
  }
  return true;
}

export function getReacoveryLocationData({ values, dataKey }) {
  return values[dataKey];
}

export function enableNodeTypeVM(node) {
  if (node && node.type) {
    return (node.type.indexOf('VirtualMachine') !== -1);
  }
  return false;
}

export function enableNodeDatastore(node) {
  if (node && node.type) {
    return node.type.indexOf('Datacenter') !== -1 || node.type.indexOf('Folder') !== -1;
  }

  return false;
}

export function getVMwareVMSelectionData({ dataKey, values }) {
  return getValue(dataKey, values);
}

export function getVMFolderPaths(fieldKey, values) {
  return values[fieldKey];
}

export function getComputeResourceOptions(u, fieldKey) {
  const { values } = u;
  const dataKey = fieldKey.replace('hostMoref', 'COMPUTERESOURCEDATA');
  const res = values[dataKey] || [];
  return res;
}

export function getDatastoreOptions(u, fieldKey) {
  const { values } = u;
  const dataKey = fieldKey.replace('dataStoreMoref', 'DATASTORE');
  const res = values[dataKey] || [];
  return res;
}

export function getWMwareNetworkOptions(u, f) {
  const { values } = u;
  let netwrokInd = f.split('-');
  netwrokInd = netwrokInd[netwrokInd.length - 2];
  const splitKey = `-vmConfig.network.net1-eth-${netwrokInd}-network`;
  const key = f.split(splitKey);
  const [moref] = key;
  const netOpt = `${moref}.general.network`;
  const res = values[netOpt];
  return res;
}

export function getMinMaxVal(user) {
  const { values } = user;
  const min = getValue('ui.memory.min', values);
  const max = getValue('ui.memory.max', values);
  return { min, max };
}

export function getVMwareAdpaterOption(u) {
  const { values } = u;
  const res = values['ui.drplan.adapterType'] || [];
  return res;
}

export function convertMemoryToMb(memory, unit) {
  if (unit === 'MB') {
    return memory;
  }
  if (unit === 'TB') {
    const res = memory * 1048576;
    return res;
  }
  if (unit === 'GB') {
    const res = memory * 1024;
    return res;
  }
}

export function validateMacAddressForVMwareNetwork(macAddress) {
  const regex = MAC_ADDRESS;

  const val = regex.test(macAddress);
  return val;
}

export function findObj(obj, fieldVal) {
  const objKeys = Object.keys(obj);
  for (let i = 0; i < objKeys.length; i += 1) {
    if (obj[objKeys[i]] === fieldVal) {
      return true;
    } if (typeof obj[objKeys[i]] === 'object' && obj[objKeys[i]].length > 0) {
      const a = getVMwareLocationPath(obj[objKeys[i]], fieldVal);
      if (a) {
        return true;
      }
    }
  }
}

export function getVMwareLocationPath(data, fieldVal) {
  const res = data || [];
  for (let i = 0; i < res.length; i += 1) {
    const keys = findObj(res[i], fieldVal);
    if (keys) {
      return res[i];
    }
  }
}

export const diableVMwareMemory = (user, fieldKey) => {
  const { values } = user;
  const fieldKeyUnit = `${fieldKey}-unit`;
  const memoryUnit = getValue(fieldKeyUnit, values);
  if (!memoryUnit && memoryUnit.length === 0) {
    return true;
  }
  return false;
};
export function getMatchingInsType(values, ins) {
  const savedInsType = getValue('ui.values.instances', values) || [];
  const insType = {};
  if (savedInsType.length > 0) {
    savedInsType.forEach((inst) => {
      if (inst.value === ins.instanceType) {
        insType.label = inst.label;
        insType.value = inst.value;
      }
    });
  }
  // If no data found then set value as received value
  if (Object.keys(insType).length === 0) {
    insType.label = ins.instanceType;
    insType.value = ins.instanceType;
  }
  return insType;
}

export function showInstallCloudPackageOption(user) {
  const { values } = user;
  const recoveryType = getValue('ui.values.recoveryPlatform', values);
  if (recoveryType === PLATFORM_TYPES.VMware || recoveryType === PLATFORM_TYPES.Azure) {
    return false;
  }
  return true;
}

export function getReplicationScript(key) {
  const data = [
    {
      hasChildren: true,
      title: 'Replication Scripts',
      children: {
        [`${key}-protection.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.protection.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
        [`${key}-protection.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.protection.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
      },
    }];
  return data;
}

export function getRecoveryScript(key) {
  const data = [
    {
      hasChildren: true,
      title: 'Recovery Scripts',
      children: {
        [`${key}-vmConfig.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.instance.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
        [`${key}-vmConfig.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.instance.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
      },
    }];
  return data;
}

export function getVMwareGeneralSettings(key, vm) {
  const data = [
    {
      hasChildren: true,
      title: 'General',
      children: {
        [`${key}-vmConfig.general.guestOS`]: { label: 'GuestOS Family', fieldInfo: 'info.protectionplan.resource.guest.os', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select guest operating system', shouldShow: true, options: (u) => getSupportedOSTypes(u) },
        [`${key}-vmConfig.general.firmwareType`]: { label: 'Firmware Type', fieldInfo: 'info.protectionplan.resource.firmware', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select Firmware Type', shouldShow: true, options: (u) => getFirmwareTypes(u) },
        [`${key}-vmConfig.general.folderPath`]: { label: 'Location', description: '', type: STACK_COMPONENT_LOCATION, dataKey: 'ui.drplan.vms.location', isMultiSelect: false, errorMessage: 'Required virtual machine path', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.vmware.folder.location', getTreeData: ({ values, dataKey }) => getReacoveryLocationData({ values, dataKey }), baseURL: API_FETCH_VMWARE_LOCATION, baseURLIDReplace: '<id>:ui.values.recoverySiteID', urlParms: ['type', 'entity'], urlParmKey: ['static:Folder', 'object:value'], highLightSelection: true, enableSelection: (node) => enableNodeDatastore(node) },
        [`${key}-vmConfig.general.hostMoref`]: { label: 'Compute', fieldInfo: 'info.vmware.compute', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select compute resourced.', shouldShow: true, options: (u, fieldKey) => getComputeResourceOptions(u, fieldKey), onChange: (user, dispatch) => getStorageForVMware(user, dispatch, true) },
        [`${key}-vmConfig.general.dataStoreMoref`]: { label: 'Storage', fieldInfo: 'info.vmware.storage', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select storage', shouldShow: true, options: (u, fieldKey) => getDatastoreOptions(u, fieldKey) },
        [`${key}-vmConfig.general.numcpu`]: { label: 'CPU', description: '', type: FIELD_TYPE.NUMBER, errorMessage: 'Required Memory', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.vmware.cpu', min: 1, max: 128, defaultValue: 1 },
        [`${key}-vmConfig.general`]: { label: 'Memory', description: '', validate: ({ user, fieldKey }) => isMemoryValueValid({ user, fieldKey }), type: STACK_COMPONENT_MEMORY, errorMessage: 'Required Memory Units', shouldShow: true, fieldInfo: 'info.vmware.memory.unit', min: 1, max: 12 },
      },
    },
    {
      hasChildren: true,
      title: 'Network',
      children: {
        [`${key}-vmConfig.network.net1`]: { label: '', type: STACK_COMPONENT_NETWORK, validate: null, errorMessage: '', shouldShow: true, options: (u) => getInstanceTypeOptions(u), data: vm },
      },
    },
  ];
  return data;
}

export function getAzureGeneralSettings(key, vm) {
  const data = [
    {
      hasChildren: true,
      title: 'General',
      children: {
        [`${key}-vmConfig.general.guestOS`]: { label: 'GuestOS Family', fieldInfo: 'info.protectionplan.resource.guest.os', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select guest operating system', shouldShow: true, options: (u) => getSupportedOSTypes(u) },
        [`${key}-vmConfig.general.firmwareType`]: { label: 'Firmware Type', fieldInfo: 'info.protectionplan.resource.firmware', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select Firmware Type', shouldShow: true, options: (u) => getFirmwareTypes(u) },
        [`${key}-vmConfig.general.folderPath`]: { label: 'Resource Group', fieldInfo: 'info.protectionplan.resource.group.azure', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select Resource Group', shouldShow: true, options: (u) => getResourceTypeOptions(u) },
        [`${key}-vmConfig.general.availibility.zone`]: { label: 'Availability Zone', fieldInfo: 'info.protectionplan.availibility.zone.azure', type: FIELD_TYPE.SELECT, errorMessage: 'Select Availability Zone', shouldShow: true, options: (u) => getAvailibilityZoneOptions(u) },
        [`${key}-vmConfig.general.instanceType`]: { label: 'VM Size', fieldInfo: 'info.protectionplan.vmsize.azure', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
        [`${key}-vmConfig.general.volumeType`]: { label: 'Volume Type', fieldInfo: 'info.protectionplan.volume.type.azure', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select volume type.', shouldShow: true, options: (u) => getStorageTypeOptions(u), onChange: (user, dispatch) => onAwsStorageTypeChange(user, dispatch), disabled: (u, f) => shouldDisableStorageType(u, f) },
        [`${key}-vmConfig.general.tags`]: { label: 'Tags', fieldInfo: 'info.protectionplan.tags.azure', type: STACK_COMPONENT_TAGS, validate: null, errorMessage: '', shouldShow: true },
      },
    },
    {
      hasChildren: true,
      title: 'Network',
      children: {
        [`${key}-vmConfig.network.net1`]: { label: 'IP Address', fieldInfo: 'info.protectionplan.instance.network.aws', type: STACK_COMPONENT_NETWORK, validate: null, errorMessage: '', shouldShow: true, options: (u) => getInstanceTypeOptions(u), data: vm },
      },
    },
  ];
  return data;
}

export function disableSiteSelection(user) {
  const { values } = user;
  const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  if (workflow === UI_WORKFLOW.EDIT_PLAN) {
    return true;
  }
  return false;
}

export function getSupportedOSTypes() {
  const osList = [];
  Object.keys(SUPPORTED_GUEST_OS).forEach((key) => {
    const obj = {};
    obj.label = key;
    obj.value = SUPPORTED_GUEST_OS[key];
    osList.push(obj);
  });
  return osList;
}

export function getFirmwareTypes() {
  const frmList = [];
  Object.keys(SUPPORTED_FIRMWARE).forEach((key) => {
    const obj = {};
    obj.label = key;
    obj.value = SUPPORTED_FIRMWARE[key];
    frmList.push(obj);
  });
  return frmList;
}

export function getMatchingOSType(value) {
  let res = '';
  if (value) {
    Object.keys(SUPPORTED_GUEST_OS).forEach((key) => {
      if (value.toLowerCase().indexOf(SUPPORTED_GUEST_OS[key].toLowerCase()) !== -1) {
        res = SUPPORTED_GUEST_OS[key];
      }
    });
  }
  if (value.toLowerCase().indexOf('red hat') !== -1) {
    res = SUPPORTED_GUEST_OS.Rhel;
  }
  // reset
  return res;
}

export function showReverseReplType(user) {
  const { values } = user;
  const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  if (workflow !== UI_WORKFLOW.REVERSE_PLAN) {
    return false;
  }

  return true;
}

// get matching firmware type
export function getMatchingFirmwareType(value) {
  let res = '';
  if (value) {
    Object.keys(SUPPORTED_FIRMWARE).forEach((key) => {
      if (value.toLowerCase().indexOf(SUPPORTED_FIRMWARE[key].toLowerCase()) !== -1) {
        res = SUPPORTED_FIRMWARE[key];
      }
    });
  }
  if (res !== '') {
    return res;
  }
  if (value.toLowerCase().indexOf('uefi_secure_vTPM') !== -1) {
    return SUPPORTED_FIRMWARE.UEFISecurevTPM;
  }
  if (value.toLowerCase().indexOf('uefi_vTPM') !== -1) {
    return SUPPORTED_FIRMWARE.UEFIvTPM;
  }
  if (value.toLowerCase().indexOf('uefi_secure') !== -1) {
    return SUPPORTED_FIRMWARE.UEFISecure;
  }
  if (value.toLowerCase().indexOf('bios') !== -1) {
    res = SUPPORTED_FIRMWARE.BIOS;
  }
  if (value.toLowerCase().indexOf('uefi') !== -1) {
    res = SUPPORTED_FIRMWARE.UEFI;
  }
  // reset
  return res;
}

export function showRevPrefix(user) {
  const { values } = user;
  const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  const revEntityType = getValue(STATIC_KEYS.UI_REVERSE_RECOVERY_ENTITY, values);
  if (workflow === UI_WORKFLOW.REVERSE_PLAN && revEntityType === REVERSE_ENTITY_TYPE.CREATE_NEW_COPY) {
    return true;
  }
  return false;
}

/**
 *
 * @returns array checkpoint duration options
 */

export function getCheckpointDurationOption() {
  const options = [
    { label: 'Day(s)', value: 'day' },
    { label: 'Week(s)', value: 'week' },
    { label: 'Month(s)', value: 'month' },
    { label: 'Year(s)', value: 'year' },
  ];
  return options;
}

/**
 *
 * @returns array of retention period options
 */

export function getCheckRentaintionOption() {
  const options = [
    { label: 'Hour(s)', value: 'hour' },
    { label: 'Day(s)', value: 'day' },
    { label: 'Week(s)', value: 'week' },
    { label: 'Month(s)', value: 'month' },
    { label: 'Year(s)', value: 'year' },
  ];
  return options;
}

/**
 *
 * @param {*} user
 * @param {*} fieldKey
 * @returns arrau of  recovery checkpoint option for vm while doing recovery
 */

export function getVmCheckpointOptions(user, fieldKey) {
  const { values } = user;
  const fieldKeyArr = fieldKey.split('-recovery-checkpoint');
  const vmId = fieldKeyArr[0];
  const recoveryCheckpoint = getValue(STATIC_KEYS.UI_RECOVERY_CHECKPOINTS_BY_VM_ID, values);
  const vmMorefs = Object.keys(recoveryCheckpoint);
  const options = [];
  vmMorefs.forEach((rec) => {
    if (rec === vmId.toString()) {
      const vmCheckpointOptions = recoveryCheckpoint[rec];
      vmCheckpointOptions.forEach((checkpoint, index) => {
        if (index > 0) {
          let time = checkpoint.creationTime ? checkpoint.creationTime : checkpoint.recoveryPointTime;
          time *= 1000;
          const d = new Date(time);
          let resp = '';
          resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
          options.push({ label: resp, value: checkpoint.id, creationTime: checkpoint.creationTime });
        }
      });
    }
  });
  return options;
}

/**
 * IF plan has recovery checkpoint then show option to remove checkpoint while doing reverse
 * @param {*} user
 * @returns
 */

export function revShowRemoveCheckpointOption(user) {
  const { values } = user;
  const planId = getValue('recovery.protectionplanID', values);
  const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  const isCheckpointAvilable = getValue(`${planId}-has-checkpoints`, values);
  if (workflow === UI_WORKFLOW.REVERSE_PLAN && isCheckpointAvilable) {
    return true;
  }
  return false;
}

export function isVMwareOSDisk(disk) {
  let isOsDisk = false;
  if (disk) {
    VMWARE_OS_DISK_DEVICE_KEYS.forEach((key) => {
      if (disk.deviceKey === key) {
        isOsDisk = true;
      }
    });
  }
  return isOsDisk;
}

export function getDiskLabel(disk, index, isVMwareSource) {
  const label = `Data Disk-${index}`;
  let isOSDisk = false;
  if (isVMwareSource) {
    isOSDisk = isVMwareOSDisk(disk);
  } else {
    isOSDisk = index === 0;
  }
  if (isOSDisk) {
    return 'OS Disk';
  }
  return label;
}

export function isVMRecovered(vmData) {
  if (vmData && vmData.status === RECOVERY_STATUS.MIGRATED || vmData.status === RECOVERY_STATUS.RECOVERED) {
    return true;
  }
  return false;
}

/**
 *select default checkpoint for vm while doing recovery
 * @param {*} user
 * @param {*} dispatch
 * @returns
 */

export function defaultRecoveryCheckpointForVm({ user, dispatch, recoveryCheckpoint }) {
  const { values } = user;
  const uniqueCheckpointValue = getValue('ui.unique.checkpoint.field', values);
  let checkpointObj = {};
  let checkPointHasCommonPoint = false;
  if (uniqueCheckpointValue !== '' && typeof recoveryCheckpoint !== 'undefined' && recoveryCheckpoint.length > 0) {
    for (let i = 0; i < recoveryCheckpoint.length; i += 1) {
      const checkpoint = recoveryCheckpoint[i];
      if (checkpoint.checkpointScheduleTime === uniqueCheckpointValue.value) {
        let time = checkpoint.creationTime;
        time *= 1000;
        const d = new Date(time);
        let resp = '';
        resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
        const changedValue = { label: resp, value: checkpoint.id };
        dispatch(valueChange(`${checkpoint.workloadID}-recovery-checkpoint`, changedValue));
        checkpointObj = { label: resp, value: checkpoint.id };
        checkPointHasCommonPoint = true;
        break;
      }
    }
  }

  // if a checkpoint does not have a common checkpoint and if that checkpoint has some value then clear that value
  // on common checkpoint change
  if (!checkPointHasCommonPoint && recoveryCheckpoint?.length > 0) {
    dispatch(valueChange(`${recoveryCheckpoint[1].workloadID}-recovery-checkpoint`, ''));
  }
  return checkpointObj;
}

/**
 *On individual vm recovery checkpoint option change
 * @param object containing value and fieldkey
 * @returns
 */
export function onVmRecoveryCheckpointOptionChange({ fieldKey, selectedOption }) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const checkpointIds = [];
    const vmMoref = fieldKey.split('-recovery-checkpoint');
    const vms = getValue(STATIC_KEYS.UI_RECOVERY_CHECKPOINTS_BY_VM_ID, values);
    let commonCheckpoint = selectedOption.creationTime;
    Object.keys(vms).forEach((key) => {
      const vmCheckpoint = getValue(`${key}-recovery-checkpoint`, values);
      // varify if other vm's creation time is equal and skip current checkpoint
      if (vmCheckpoint.creationTime !== commonCheckpoint && selectedOption.value !== vms[key].id) {
        commonCheckpoint = '';
      }
    });
    if (commonCheckpoint === '') {
      dispatch(valueChange(STORE_KEYS.UI_CHECKPOINT_SELECT_WARNING, t('recovery.checkpoint.onchange.warn')));
    } else {
      dispatch(valueChange(STORE_KEYS.UI_CHECKPOINT_SELECT_WARNING, ''));
    }
    const { value } = selectedOption;
    checkpointIds.push(value);
    dispatch(recoveryConfigOnCheckpointChanges(checkpointIds, vmMoref[0]));
  };
}

export function getDatamotiveRoles(user) {
  const { values } = user;
  const roles = getValue('ui.values.roles', values) || [];
  const rListOptions = [];
  roles.forEach((role) => {
    const obj = {};
    obj.label = role.name;
    obj.value = role.name;
    rListOptions.push(obj);
  });
  rListOptions.push({ label: '', value: '' });
  return rListOptions;
}

export function userRoleOptions(user) {
  const { roles } = user;
  const result = [];
  if (roles) {
    roles.reduce((previous, next) => {
      previous.push({ label: next.name, value: next.name });
      return previous;
    }, result);
  }
  return result;
}

export const getGCPNetworkValue = (value) => {
  let networkValue = value.split('/');
  networkValue = networkValue[networkValue.length - 1];
  return networkValue;
};
export function commonCheckpointOptions(user) {
  const { values } = user;
  const uniqueOptions = getValue(STATIC_KEYS.UI_COMMON_CHECKPOINT_OPTIONS, values);
  const options = [];
  if (uniqueOptions) {
    for (let i = 0; i < uniqueOptions.length; i += 1) {
      const time = uniqueOptions[i].checkpointScheduleTime * 1000;
      const d = new Date(time);
      let resp = '';
      resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
      options.push({ label: resp, value: uniqueOptions[i].checkpointScheduleTime });
    }
  }
  return options;
}

/**
 * On common recovery checkpoint option changes
 * it changes recovery configs which has checkpoint equal to common checkpoint option
 * @returns
 */
export function onCommonCheckpointChange({ value }) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const vmRecoveryCheckpoints = getValue(STATIC_KEYS.UI_RECOVERY_CHECKPOINTS_BY_VM_ID, values);
    const checkpointIds = [];
    let vmsCountWithoutCommonCheckpoint = 0;
    if (vmRecoveryCheckpoints !== '') {
      Object.keys(vmRecoveryCheckpoints).forEach((el) => {
        const checkpointid = defaultRecoveryCheckpointForVm({ user, dispatch, recoveryCheckpoint: vmRecoveryCheckpoints[el] });
        if (typeof checkpointid?.value !== 'undefined') {
          checkpointIds.push(checkpointid.value);
        } else {
          vmsCountWithoutCommonCheckpoint += 1;
        }
      });
    }
    if (value !== '' && vmsCountWithoutCommonCheckpoint > 0) {
      // Add checkpoint warning text
      dispatch(valueChange(STORE_KEYS.UI_CHECKPOINT_SELECT_WARNING, t('recovery.checkpoint.onchange.warn')));
    } else {
      dispatch(valueChange(STORE_KEYS.UI_CHECKPOINT_SELECT_WARNING, ''));
    }
    // if common checkpoint is selected then only fetch the data as common checkpoint can be empty
    if (value !== '') {
      dispatch(recoveryConfigOnCheckpointChanges(checkpointIds));
    }
  };
}

export function showRecipientEmailField(user) {
  const { values } = user;
  const isValidateEmail = getValue(EMAIL.RECIPIENT_ISVALIDATE, values);
  if (!isValidateEmail) {
    return false;
  }
  return true;
}
