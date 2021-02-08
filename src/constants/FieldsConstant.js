import { onPlatformTypeChange } from '../store/actions';
import { onProtectionPlanChange } from '../store/actions/DrPlanActions';
import { onProtectSiteChange, onRecoverSiteChange } from '../store/actions/SiteActions';
import { getAvailibilityZoneOptions, getDRPlanOptions, getPostScriptsOptions, getPreScriptsOptions, getRegionOptions, getReplicationIntervalOptions, getSitesOptions, getSubnetOptions, isPlatformTypeAWS, isPlatformTypeGCP, isPlatformTypeVMware } from '../utils/InputUtils';
import { isEmpty, validateDrSiteSelection } from '../utils/validationUtils';
import { STATIC_KEYS } from './InputConstants';
import { HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX, IP_REGEX } from './ValidationConstants';

export const CONFIURE_SITE_GROUP = ['configureSite.platformDetails.type', 'configureSite.platformDetails.platformName'];
export const REPLICATION_INTERVAL_COMP = 'REPLICATION_INTERVAL_COMP';
export const FIELD_TYPE = {
  CHECKBOX: 'CHECKBOX', TEXT: 'TEXT', SELECT: 'SELECT', NUMBER: 'NUMBER', PASSOWRD: 'PASSWORD', CUSTOM: 'CUSTOM',
};
export const FIELDS = {
  // CONFIGURE SITE FIELDS
  'configureSite.siteType': {
    label: 'site.type', placeHolderText: 'Select Site', type: FIELD_TYPE.SELECT, options: [{ label: 'Protection', value: 'Protect' }, { label: 'Recover', value: 'Recovery' }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Select site type', shouldShow: true,
  },
  'configureSite.platformDetails.platformType': {
    label: 'platform.type', description: 'Select Platform Type', type: FIELD_TYPE.SELECT, options: [{ label: 'VMware', value: 'VMware' }, { label: 'AWS', value: 'AWS' }, { label: 'GCP', value: 'GCP' }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Select Platform Type', shouldShow: true, onChange: (user, dispatch) => onPlatformTypeChange(user, dispatch),
  },
  'configureSite.platformDetails.platformName': {
    label: 'platform.name', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform name required', shouldShow: true,
  },
  'configureSite.Description': {
    label: 'description', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Site Description Required', shouldShow: true,
  },
  'configureSite.platformDetails.hostname': {
    label: 'vCenter.server.IP', description: '', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid IP address', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.port': {
    label: 'port', description: '', defaultValue: 443, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Port value required, if different.', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.username': {
    label: 'username', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Username required', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.password': {
    label: 'password', description: '', type: FIELD_TYPE.PASSOWRD, validate: (value, user) => isEmpty(value, user), errorMessage: 'Password required', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.region': {
    label: 'region', description: '', type: FIELD_TYPE.SELECT, errorMessage: 'Region required', shouldShow: true, options: (user) => getRegionOptions(user),
  },
  'configureSite.platformDetails.availZone': {
    label: 'zone', description: '', type: FIELD_TYPE.SELECT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Zone required', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user), options: (user) => getAvailibilityZoneOptions(user),
  },
  'configureSite.platformDetails.secretKey': {
    label: 'secret.key', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), shouldShow: (user) => isPlatformTypeAWS(user),
  },
  'configureSite.platformDetails.accessKey': {
    label: 'access.key', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Access Key is required', shouldShow: (user) => isPlatformTypeAWS(user),
  },
  'configureSite.platformDetails.projectId': {
    label: 'project.ID', description: '', type: FIELD_TYPE.TEXT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Project ID is required', shouldShow: (user) => isPlatformTypeGCP(user),
  },
  'configureSite.platformDetails.serverIp': {
    label: 'datamotive.server.IP', description: '', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid IP address', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  },
  'configureSite.platformDetails.serverPort': {
    label: 'server.port', description: '', defaultValue: 5000, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Server Port is required, if different.', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  },
  'configureSite.platformDetails.prepMachineIP': {
    label: 'preparation.machine.IP', description: '', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid Machine IP address', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  },

  'TEST.site.platformName': {
    label: 'Platform Name', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform name required',
  },

  'drplan.name': {
    label: 'name', description: 'Disaster recovery plan name', type: FIELD_TYPE.TEXT, errorMessage: 'Required disaster recovery plan name', shouldShow: true, validate: (value, user) => isEmpty(value, user),
  },
  'drplan.replicationInterval': {
    label: 'Interval', description: 'Replication Interval', type: FIELD_TYPE.SELECT, options: (user) => getReplicationIntervalOptions(user), errorMessage: 'Replication Interval Rquired', shouldShow: true, defaultValue: 10,
  },
  'replication.inerval': { type: FIELD_TYPE.CUSTOM, COMPONENT: REPLICATION_INTERVAL_COMP },

  'drplan.subnet': { label: 'Subnet', placeHolderText: 'Subnet', type: FIELD_TYPE.SELECT, options: (user) => getSubnetOptions(user), errorMessage: 'Select subnet', shouldShow: true, validate: null },
  'drplan.isEncryptionOnWire': { label: 'Encryption On Wire', description: 'Encryption On Wire', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'drplan.isEncryptionOnRest': { label: 'Encryption On Rest', description: 'Encryption On Rest', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'drplan.isCompression': { label: 'Enable Compression', description: 'Enable Compression', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'drplan.isDedupe': { label: 'Enable Dedupe', description: 'Enable Compression', type: FIELD_TYPE.CHECKBOX, shouldShow: false, defaultValue: false },
  'drplan.preScript': { label: 'Pre Script', placeHolderText: 'Pre Script', type: FIELD_TYPE.SELECT, options: (user) => getPreScriptsOptions(user), errorMessage: 'Select pre script', shouldShow: true },
  'drplan.postScript': { label: 'Post Script', placeHolderText: 'Post Script', type: FIELD_TYPE.SELECT, options: (user) => getPostScriptsOptions(user), errorMessage: 'Select post script', shouldShow: true },

  'drplan.retryCount': {
    label: 'retry.count', description: 'Retry Count', type: FIELD_TYPE.NUMBER, errorMessage: 'Retry Count', shouldShow: true,
  },
  'drplan.failureActions': {
    label: 'failure.actions', description: 'Failure Actions', type: FIELD_TYPE.TEXT, errorMessage: 'Failure Actions', shouldShow: true, validate: (value, user) => isEmpty(value, user),
  },
  'drplan.throttleTime': {
    label: 'throttle.time', description: 'Failure Actions', type: FIELD_TYPE.TEXT, errorMessage: 'Failure Actions', shouldShow: true, validate: (value, user) => isEmpty(value, user),
  },
  'drplan.throttleBandwidth': {
    label: 'throttle.bandwidth', description: 'Retry Count', type: FIELD_TYPE.NUMBER, errorMessage: 'Retry Count', shouldShow: true,
  },
  'drplan.protectedSite': {
    label: 'protect.site', placeHolderText: 'Protect Site', type: FIELD_TYPE.SELECT, options: (user) => getSitesOptions(user), errorMessage: 'Select site', shouldShow: true, validate: (user) => validateDrSiteSelection(user), onChange: (user, dispatch) => onProtectSiteChange(user, dispatch),
  },
  'drplan.recoverySite': {
    label: 'recovery.site', placeHolderText: 'Recovery Site', type: FIELD_TYPE.SELECT, options: (user) => getSitesOptions(user), errorMessage: 'Select recovery site. Recovery can protect sites can not be same.', shouldShow: true, validate: (user) => validateDrSiteSelection(user), onChange: (user, dispatch) => onRecoverSiteChange(user, dispatch),
  },
  'drplan.recoveryEntities.name': { label: '', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: false },
  'drplan.protectedEntities.Name': { label: '', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: false },
  'recovery.protectionplanID': { label: 'protection.plan', placeHolderText: '', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (user) => getDRPlanOptions(user), onChange: (user, dispatch) => onProtectionPlanChange(user, dispatch) },
  'recovery.dryrun': { label: 'dry.run', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, validate: null, errorMessage: '', shouldShow: true, defaultValue: true },
  // 'recovery.winUser': { label: 'machine.username', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: true },
  // 'recovery.winPassword': { label: 'machine.password', placeHolderText: '', type: FIELD_TYPE.PASSOWRD, validate: null, errorMessage: '', shouldShow: true },
  'recovery.vmNames': { label: '', placeHolderText: '', type: FIELD_TYPE.PASSOWRD, validate: null, errorMessage: '', shouldShow: false },
  'ui.values.replication.interval.type': {
    label: 'Unit', placeHolderText: 'Select replication unit', type: FIELD_TYPE.SELECT, options: [{ label: 'Day', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_DAY }, { label: 'Hour', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_HOUR }, { label: 'Minutes', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_MIN }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Select replication unit.', shouldShow: true, defaultValue: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_MIN,
  },
  'login.username': { label: 'Username', id: 'userName', name: 'Username', placeHolderText: 'Enter username', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Username required', shouldShow: true, layout: 'vertical' },
  'login.password': { label: 'Password', id: 'password', name: 'Password', placeHolderText: 'Enter password', type: FIELD_TYPE.PASSOWRD, validate: (value, user) => isEmpty(value, user), errorMessage: 'Password required', shouldShow: true, layout: 'vertical' },
};
