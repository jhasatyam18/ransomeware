import { API_FETCH_VMWARE_LOCATION } from '../constants/ApiConstants';
import { STACK_COMPONENT_NETWORK, STACK_COMPONENT_LOCATION, STACK_COMPONENT_MEMORY, STACK_COMPONENT_SECURITY_GROUP, STACK_COMPONENT_TAGS } from '../constants/StackConstants';
import { FIELDS, FIELD_TYPE } from '../constants/FieldsConstant';
import { EXCLUDE_KEYS_CONSTANTS, EXCLUDE_KEYS_RECOVERY_CONFIGURATION, PLATFORM_TYPES, SCRIPT_TYPE, STATIC_KEYS } from '../constants/InputConstants';
import { NODE_STATUS_ONLINE } from '../constants/AppStatus';
import { isEmpty, isMemoryValueValid } from './validationUtils';
import { getStorageForVMware, onScriptChange } from '../store/actions';
import { onAwsStorageTypeChange } from '../store/actions/AwsActions';

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

export function getSitesOptions(user) {
  const { values } = user;
  const sites = getValue(STATIC_KEYS.UI_SITES, values);
  const result = [];
  if (sites) {
    sites.reduce((previous, next) => {
      previous.push({ label: next.name, value: next.id });
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
      {
        hasChildren: true,
        title: 'Replication Scripts',
        children: {
          [`${key}-protection.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.protection.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
          [`${key}-protection.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.protection.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
        },
      },
      {
        hasChildren: true,
        title: 'Recovery Scripts',
        children: {
          [`${key}-vmConfig.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.instance.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
          [`${key}-vmConfig.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.instance.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
        },
      },
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
          [`${key}-vmConfig.general.instanceType`]: { label: 'Instance Type', fieldInfo: 'info.protectionplan.instance.type', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
          [`${key}-vmConfig.general.volumeType`]: { label: 'Volume Type', fieldInfo: 'info.protectionplan.instance.volume.type.aws', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select volume type.', shouldShow: true, options: (u) => getStorageTypeOptions(u), onChange: (user, dispatch) => onAwsStorageTypeChange(user, dispatch), disabled: (u, f) => shouldDisableStorageType(u, f) },
          [`${key}-vmConfig.general.volumeIOPS`]: { label: 'Volume IOPS', fieldInfo: 'info.protectionplan.instance.volume.iops.aws', type: FIELD_TYPE.NUMBER, errorMessage: 'Provide volume IOPS.', disabled: (u, f) => shouldEnableAWSIOPS(u, f), min: 0 },
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
      {
        hasChildren: true,
        title: 'Replication Scripts',
        children: {
          [`${key}-protection.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.protection.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
          [`${key}-protection.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.protection.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
        },
      },
      {
        hasChildren: true,
        title: 'Recovery Scripts',
        children: {
          [`${key}-vmConfig.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.instance.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
          [`${key}-vmConfig.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.instance.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
        },
      },
    ],
  };
  return config;
}

export function getVMwareVMConfig(vm) {
  const key = (typeof vm === 'string' ? vm : vm.moref);
  const config = {
    data: [
      {
        hasChildren: true,
        title: 'Configurtion',
        children: {
          [`${key}-vmConfig.general.folderPath`]: { label: 'Location', description: '', type: STACK_COMPONENT_LOCATION, dataKey: 'ui.drplan.vms.location', isMultiSelect: false, errorMessage: 'Required virtual machine path', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.vmware.folder.location', getTreeData: ({ values, dataKey }) => getReacoveryLocationData({ values, dataKey }), baseURL: API_FETCH_VMWARE_LOCATION, baseURLIDReplace: '<id>:ui.values.recoverySiteID', urlParms: ['type', 'entity'], urlParmKey: ['static:Folder', 'object:value'], enableSelection: (node) => enableNodeDatastore(node) },
          [`${key}-vmConfig.general.hostMoref`]: { label: 'Compute', fieldInfo: 'info.vmware.compute', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select compute resourced.', shouldShow: true, options: (u, fieldKey) => getComputeResourceOptions(u, fieldKey), onChange: (user, dispatch) => getStorageForVMware(user, dispatch) },
          [`${key}-vmConfig.general.dataStoreMoref`]: { label: 'Storage', fieldInfo: 'info.vmware.storage', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select storage', shouldShow: true, options: (u, fieldKey) => getDatastoreOptions(u, fieldKey) },
          [`${key}-vmConfig.general.numcpu`]: { label: 'CPU', description: '', type: FIELD_TYPE.NUMBER, errorMessage: 'Required Memory', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.vmware.cpu', min: 1, max: 128, defaultValue: 2 },
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
      {
        hasChildren: true,
        title: 'Replication Scripts',
        children: {
          [`${key}-protection.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.protection.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
          [`${key}-protection.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.protection.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
        },
      },
      {
        hasChildren: true,
        title: 'Recovery Scripts',
        children: {
          [`${key}-vmConfig.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.instance.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
          [`${key}-vmConfig.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.instance.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
        },
      },
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

export function shouldShowNodeEncryptionKey(user) {
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
  const keys = fieldKey.split('.');
  const iopsKey = `${keys.slice(0, keys.length - 1).join('.')}.volumeType`;
  const storageType = getValue(iopsKey, values);
  if (storageType === 'gp2') {
    return true;
  }
  if (isVMAlertAction(user)) {
    return true;
  }
  return false;
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
  const vms = getValue('ui.site.seletedVMs', values);
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
  let key = f.split('.');
  key = key.splice(0, [key.length - 2]);
  const str = key.join('');
  const str2 = `${str}.general.network`;
  const res = values[str2];
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
  const regex = /^([0-9a-fA-F]{2}[:-]){5}([0-9a-fA-F]{2})$/;

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
  const res = data;
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
  const savedInsType = getValue('ui.values.instances', values);
  const insType = {};
  savedInsType.forEach((inst) => {
    if (inst.value === ins.instanceType) {
      insType.label = inst.label;
      insType.value = inst.value;
    }
  });
  return insType;
}

export function convertKBtoUnit(data) {
  const sizes = ['KB', 'MB', 'GB', 'TB'];
  if (data === 0) return '-';
  const i = parseInt(Math.floor(Math.log(data) / Math.log(1024)), 10);
  if (i >= sizes.length) return '-';
  return `${Math.round(data / 1024 ** i, 2)} ${sizes[i]}`;
}

export function showInstallCloudPackageOption(user) {
  const { values } = user;
  const recoveryType = getValue('ui.values.recoveryPlatform', values);
  if (recoveryType === PLATFORM_TYPES.VMware) {
    return false;
  }
  return true;
}
