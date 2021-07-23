import { onPlatformTypeChange } from '../store/actions';
import { onProtectionPlanChange } from '../store/actions/DrPlanActions';
import { onProtectSiteChange, onRecoverSiteChange, updateAvailabilityZones } from '../store/actions/SiteActions';
import { getAvailibilityZoneOptions, getDRPlanOptions, getPostScriptsOptions, getPreScriptsOptions, getRegionOptions, getReplicationIntervalOptions, getSitesOptions, getSubnetOptions, isPlatformTypeAWS, isPlatformTypeGCP, isPlatformTypeVMware } from '../utils/InputUtils';
import { isEmpty, validateDrSiteSelection } from '../utils/validationUtils';
import { STATIC_KEYS } from './InputConstants';
import { HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX, IP_REGEX } from './ValidationConstants';

export const CONFIURE_SITE_GROUP = ['configureSite.platformDetails.type', 'configureSite.platformDetails.platformName'];
export const REPLICATION_INTERVAL_COMP = 'REPLICATION_INTERVAL_COMP';
export const STACK_VIEW_COMPONENT = 'STACK_VIEW_COMPONENT';
export const PROTECTION_REPLICATION_JOBS = 'PROTECTION_REPLICATION_JOBS';
export const FIELD_TYPE = {
  CHECKBOX: 'CHECKBOX', TEXT: 'TEXT', SELECT: 'SELECT', NUMBER: 'NUMBER', PASSOWRD: 'PASSWORD', CUSTOM: 'CUSTOM',
};
export const FIELDS = {
  // CONFIGURE SITE FIELDS
  'configureSite.siteType': {
    label: 'site.type', description: 'Site type whether Protection or Recovery', placeHolderText: 'Select Site', type: FIELD_TYPE.SELECT, options: [{ label: 'Protection', value: 'Protection' }, { label: 'Recover', value: 'Recovery' }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Site type required', shouldShow: true,
  },
  'configureSite.platformDetails.platformType': {
    label: 'platform.type', description: 'Platform Type whether VMware or AWS or GCP', type: FIELD_TYPE.SELECT, options: [{ label: 'VMware', value: 'VMware' }, { label: 'AWS', value: 'AWS' }, { label: 'GCP', value: 'GCP' }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform Type required', shouldShow: true, onChange: (user, dispatch) => onPlatformTypeChange(user, dispatch),
  },
  'configureSite.platformDetails.platformName': {
    label: 'platform.name', description: 'Platform Name for(VMWare/AWS/GCP)', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform name required', shouldShow: true,
  },
  'configureSite.Description': {
    label: 'description', description: 'Site description', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Site Description Required', shouldShow: true,
  },
  'configureSite.platformDetails.hostname': {
    label: 'vCenter.server.IP', description: 'vCenter Server IPv4 address', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid IP address', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.port': {
    label: 'port', description: 'vCenter Server management port', defaultValue: 443, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Port value required, if different.', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.username': {
    label: 'username', description: 'vCenter Server User Name', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Username required', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.password': {
    label: 'password', description: 'vCenter Server User Password', type: FIELD_TYPE.PASSOWRD, validate: (value, user) => isEmpty(value, user), errorMessage: 'Password required', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.region': {
    label: 'region', description: 'Cloud Site Region where Management Server is deployed and Protection needs to be done', type: FIELD_TYPE.SELECT, errorMessage: 'Region required', shouldShow: (user) => !isPlatformTypeVMware(user), options: (user) => getRegionOptions(user), onChange: (user, dispatch) => updateAvailabilityZones(user, dispatch),
  },
  'configureSite.platformDetails.availZone': {
    label: 'zone', description: 'Availability Zone for Cloud Site where Management Server is deployed and Protection needs to be done', type: FIELD_TYPE.SELECT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Zone required', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user), options: (user) => getAvailibilityZoneOptions(user),
  },
  'configureSite.platformDetails.accessKey': {
    label: 'access.key', description: 'Access Key for Cloud Site(AWS)', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Access Key is required', shouldShow: (user) => isPlatformTypeAWS(user),
  },
  'configureSite.platformDetails.secretKey': {
    label: 'secret.key', description: 'Secret Key for Cloud Site(AWS)', type: FIELD_TYPE.PASSOWRD, validate: (value, user) => isEmpty(value, user), shouldShow: (user) => isPlatformTypeAWS(user),
  },
  'configureSite.platformDetails.projectId': {
    label: 'project.ID', description: 'Project ID for Cloud Site(GCP)', type: FIELD_TYPE.TEXT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Project ID is required', shouldShow: (user) => isPlatformTypeGCP(user),
  },
  'configureSite.platformDetails.serverIp': {
    label: 'datamotive.server.IP', description: 'Datamotive Management Server IP', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid IP address', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  },
  'configureSite.platformDetails.serverPort': {
    label: 'server.port', description: 'Datamotive service port', defaultValue: 5000, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Server Port is required, if different.', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  },
  // 'configureSite.platformDetails.prepMachineIP': {
  // label: 'preparation.machine.IP', description: '', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid Machine IP address', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  // },
  'TEST.site.platformName': {
    label: 'Platform Name', description: 'Platform Name for(VMWare/AWS/GCP)', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform name required',
  },

  'drplan.name': {
    label: 'name', description: 'Protection Plan name', type: FIELD_TYPE.TEXT, errorMessage: 'Required disaster recovery plan name', shouldShow: true, validate: (value, user) => isEmpty(value, user),
  },
  'drplan.replicationInterval': {
    label: 'Interval', description: 'Replication Interval between 2 consecutive iteration', type: FIELD_TYPE.SELECT, options: (user) => getReplicationIntervalOptions(user), errorMessage: 'Replication Interval Rquired', shouldShow: true, defaultValue: 10,
  },
  'replication.inerval': { type: FIELD_TYPE.CUSTOM, COMPONENT: REPLICATION_INTERVAL_COMP },

  'drplan.subnet': { label: 'Subnet', description: 'Subnets where Protected Entity will be recovered', placeHolderText: 'Subnet', type: FIELD_TYPE.SELECT, options: (user) => getSubnetOptions(user), errorMessage: 'Select subnet', shouldShow: true, validate: null },
  'drplan.isEncryptionOnWire': { label: 'Encryption On Wire', description: 'Encryption On Wire', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'drplan.isEncryptionOnRest': { label: 'Encryption At Rest', description: 'Encryption On Rest', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'drplan.isCompression': { label: 'Compression', description: 'Enable Compression', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: true },
  'drplan.isDedupe': { label: 'Enable Dedupe', description: 'Enable De-Duplication', type: FIELD_TYPE.CHECKBOX, shouldShow: false, defaultValue: false },
  'drplan.preScript': { label: 'Pre Script', description: 'Pre Script to execute before Recovery', placeHolderText: 'Pre Script to execute before Recovery', type: FIELD_TYPE.SELECT, options: (user) => getPreScriptsOptions(user), errorMessage: 'Select pre script', shouldShow: true },
  'drplan.postScript': { label: 'Post Script', description: 'Post Script to execute post Recovery', placeHolderText: 'Post Script to execute post Recovery', type: FIELD_TYPE.SELECT, options: (user) => getPostScriptsOptions(user), errorMessage: 'Select post script', shouldShow: true },

  'drplan.retryCount': {
    label: 'retry.count', description: 'Retry Count, if specified action is failed', type: FIELD_TYPE.NUMBER, errorMessage: 'Retry Count not valid(must be a integer)', shouldShow: true,
  },
  'drplan.failureActions': {
    label: 'failure.actions', description: 'Failure Action in case retry count is exceeded', type: FIELD_TYPE.TEXT, errorMessage: 'Failure Action needs to be specified', shouldShow: true, validate: (value, user) => isEmpty(value, user),
  },
  'drplan.throttleTime': {
    label: 'throttle.time', description: 'Time elapsed for Throttling', type: FIELD_TYPE.TEXT, errorMessage: 'Invalid value for throttle time', shouldShow: true, validate: (value, user) => isEmpty(value, user),
  },
  'drplan.throttleBandwidth': {
    label: 'throttle.bandwidth', description: 'Bandwidth throttling', type: FIELD_TYPE.NUMBER, errorMessage: 'Invalid value for throttle bandwidth', shouldShow: true,
  },
  'drplan.protectedSite': {
    label: 'protect.site', description: 'Source/Protected Site', placeHolderText: 'Protect Site', type: FIELD_TYPE.SELECT, options: (user) => getSitesOptions(user), errorMessage: 'Select protection site. Protection and recovery sites cannot be same.', shouldShow: true, validate: (user) => validateDrSiteSelection(user), onChange: (user, dispatch) => onProtectSiteChange(user, dispatch),
  },
  'drplan.recoverySite': {
    label: 'recovery.site', description: 'Target/Recovery Site', placeHolderText: 'Recovery Site', type: FIELD_TYPE.SELECT, options: (user) => getSitesOptions(user), errorMessage: 'Select recovery site. Recovery and protection sites cannot be same.', shouldShow: true, validate: (user) => validateDrSiteSelection(user), onChange: (user, dispatch) => onRecoverSiteChange(user, dispatch),
  },
  'drplan.recoveryEntities.name': { label: 'recoveryentitites.name', description: 'Name for Recovery Entities', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: false },
  'drplan.protectedEntities.Name': { label: 'protectedentities.name', description: 'Name for Protected Entities', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: false },
  'recovery.protectionplanID': { label: 'protection.plan', description: ' Select Protection Plan ', placeHolderText: '', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (user) => getDRPlanOptions(user), onChange: (user, dispatch) => onProtectionPlanChange(user, dispatch) },
  'recovery.dryrun': { label: 'dry.run', description: 'Test recovery flag, check for true', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, validate: null, errorMessage: '', shouldShow: true, defaultValue: true },
  // 'recovery.winUser': { label: 'machine.username', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: true },
  // 'recovery.winPassword': { label: 'machine.password', placeHolderText: '', type: FIELD_TYPE.PASSOWRD, validate: null, errorMessage: '', shouldShow: true },
  'recovery.vmNames': { label: 'recovery.names', description: 'List of VM names which are needed to recover', placeHolderText: '', type: FIELD_TYPE.PASSOWRD, validate: null, errorMessage: '', shouldShow: false },
  'ui.values.replication.interval.type': {
    label: 'Unit', description: 'Replication interval i.e time gap after which next iteration will start after previous one is completed/failed', placeHolderText: 'Select replication unit', type: FIELD_TYPE.SELECT, options: [{ label: 'Days', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_DAY }, { label: 'Hours', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_HOUR }, { label: 'Minutes', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_MIN }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Invalid replication interval.', shouldShow: true, defaultValue: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_MIN,
  },
};
