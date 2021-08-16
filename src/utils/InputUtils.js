import { STACK_COMPONENT_NETWORK, STACK_COMPONENT_SECURITY_GROUP, STACK_COMPONENT_TAGS } from '../constants/StackConstants';
import { FIELDS, FIELD_TYPE } from '../constants/FieldsConstant';
import { PLATFORM_TYPES, SCRIPT_TYPE, STATIC_KEYS } from '../constants/InputConstants';
import { NODE_STATUS_ONLINE } from '../constants/AppStatus';
import { isEmpty } from './validationUtils';

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
  return optionsBuilder(user, key);
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
  const recoverySite = getValue('drplan.recoverySite', values);
  const sites = getValue(STATIC_KEYS.UI_SITES, values);
  const site = sites.filter((s) => `${s.id}` === `${recoverySite}`)[0];
  const { platformDetails } = site;
  const isGCP = (platformDetails.platformType === PLATFORM_TYPES.GCP);
  if (isGCP) {
    return [{ label: 'Standard', value: 'pd-standard' }, { label: 'Balanced', value: 'pd-balanced' }, { label: 'SSD', value: 'pd-ssd' }];
  }
  return [{ label: 'GP-2', value: 'gp2' }, { label: 'GP-3', value: 'gp3' }, { label: 'IO-1', value: 'io1' }, { label: 'IO-2', value: 'io2' }];
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

export function getSecurityGroupOption(user) {
  const { values } = user;
  const opts = getValue(STATIC_KEYS.UI_SECURITY_GROUPS, values) || [];
  const options = [];
  opts.forEach((op) => {
    const name = (op.name && op.name !== '' ? op.name : op.id);
    options.push({ label: name, value: op.id });
  });
  return options || [];
}

export function getSubnetOptions(user) {
  const { values } = user;
  const opts = getValue(STATIC_KEYS.UI_SUBNETS, values) || [];
  const options = [];
  opts.forEach((op) => {
    const name = (op.name && op.name !== '' ? `${op.id} (${op.name})` : op.id);
    options.push({ label: name, value: op.id });
  });
  return options;
}
export function buildRangeOptions(start, end) {
  const options = [];
  for (let i = start; i <= end; i += 1) {
    const option = { label: i, value: i };
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

export function createVMConfigStackObject(key) {
  const config = {
    data: [
      {
        hasChildren: true,
        title: 'General',
        children: {
          [`${key}-vmConfig.general.instanceType`]: { label: 'Instance Type', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
          [`${key}-vmConfig.general.volumeType`]: { label: 'Volume Type', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select volume type.', shouldShow: true, options: (u) => getStorageTypeOptions(u) },
          [`${key}-vmConfig.general.bootOrder`]: { label: 'Boot', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select boot order.', shouldShow: true, options: (u) => geBootPriorityOptions(u) },
          [`${key}-vmConfig.general.tags`]: { label: 'Tags', type: STACK_COMPONENT_TAGS, validate: null, errorMessage: '', shouldShow: true },
        },
      },
      {
        hasChildren: true,
        title: 'Network',
        children: {
          [`${key}-vmConfig.network.net1`]: { label: 'IP Address', type: STACK_COMPONENT_NETWORK, validate: null, errorMessage: '', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
          [`${key}-vmConfig.network.securityGroup`]: { label: 'Security Groups', type: STACK_COMPONENT_SECURITY_GROUP, validate: null, errorMessage: '', shouldShow: true },
        },
      },
      {
        hasChildren: true,
        title: 'Scripts',
        children: {
          [`${key}-vmConfig.scripts.preScript`]: { label: 'Pre', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u) },
          [`${key}-vmConfig.scripts.postScript`]: { label: 'Post', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u) },
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
    { label: 'Windows Preparation Machine', value: 'WinPrepMachine' },
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
  nodes = nodes.filter((node) => node.status === NODE_STATUS_ONLINE).filter((oNode) => oNode.platformType === platfomrType);
  const result = [];
  if (nodes) {
    nodes.reduce((previous, next) => {
      previous.push({ label: next.name, value: next.id });
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
    { label: 'License', value: 'License' },
    { label: 'Recovery', value: 'Recovery1' },
    { label: 'Migration', value: 'Migration1' },
    { label: 'License', value: 'License1' },
  ];
}
