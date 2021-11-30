import { onPlatformTypeChange } from '../store/actions';
import { onProtectionPlanChange } from '../store/actions/DrPlanActions';
import { onProtectSiteChange, onRecoverSiteChange, updateAvailabilityZones } from '../store/actions/SiteActions';
import { onLimitChange, onTimeLimitChange } from '../store/actions/ThrottlingAction';
import { getAvailibilityZoneOptions, getDefaultRecoverySite, getDRPlanOptions, getEventOptions, getNodeTypeOptions, getPlatformTypeOptions, getPostScriptsOptions, getPreScriptsOptions, getRegionOptions, getReplicationUnitDays, getReplicationUnitHours, getReplicationUnitMins, getReportProtectionPlans, getSiteNodeOptions, getSitesOptions, getSubnetOptions, isPlatformTypeAWS, isPlatformTypeGCP, isPlatformTypeVMware, shouldShowNodeEncryptionKey, shouldShowNodeManagementPort, shouldShowNodePlatformType, shouldShowNodeReplicationPort } from '../utils/InputUtils';
import { isEmpty, validateDrSiteSelection, validateReplicationInterval, validateReplicationValue } from '../utils/validationUtils';
import { STATIC_KEYS } from './InputConstants';
import { EMAIL_REGEX, FQDN_REGEX, HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX, IP_REGEX } from './ValidationConstants';

export const CONFIURE_SITE_GROUP = ['configureSite.platformDetails.type', 'configureSite.platformDetails.platformName'];
export const REPLICATION_INTERVAL_COMP = 'REPLICATION_INTERVAL_COMP';
export const MULTISELECT_ITEM_COMP = 'MULTISELECT_ITEM_COMP';
export const DATE_PICKER_COMP = 'DATE_PICKER';
export const TIME_PICKER_COMP = 'TIME_PICKER';
export const STACK_VIEW_COMPONENT = 'STACK_VIEW_COMPONENT';
export const PROTECTION_REPLICATION_JOBS = 'PROTECTION_REPLICATION_JOBS';
export const FIELD_TYPE = {
  CHECKBOX: 'CHECKBOX', TEXT: 'TEXT', SELECT: 'SELECT', NUMBER: 'NUMBER', PASSWORD: 'PASSWORD', CUSTOM: 'CUSTOM', RADIO: 'RADIO', RANGE: 'RANGE',
};
export const FIELDS = {
  // CONFIGURE SITE FIELDS
  'configureSite.name': {
    label: 'site.name', description: 'Site name', placeHolderText: 'Select Site', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Site name required', shouldShow: true, fieldInfo: 'info.site.name',
  },
  'configureSite.description': {
    label: 'description', description: 'Site description', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Site Description Required', shouldShow: true, fieldInfo: 'info.site.description',
  },
  'configureSite.siteType': {
    label: 'site.type', description: 'Site type whether Protection or Recovery', placeHolderText: 'Select Site', type: FIELD_TYPE.SELECT, options: [{ label: 'Protection', value: 'Protection' }, { label: 'Recover', value: 'Recovery' }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Site type required', shouldShow: true, fieldInfo: 'info.site.type',
  },
  'configureSite.platformDetails.platformType': {
    label: 'platform.type', description: 'Platform Type whether VMware or AWS or GCP', type: FIELD_TYPE.SELECT, options: [{ label: 'VMware', value: 'VMware' }, { label: 'AWS', value: 'AWS' }, { label: 'GCP', value: 'GCP' }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform Type required', shouldShow: true, onChange: (user, dispatch) => onPlatformTypeChange(user, dispatch), fieldInfo: 'info.site.platform.type',
  },
  'configureSite.node': {
    label: 'site.node', type: FIELD_TYPE.SELECT, options: (user) => getSiteNodeOptions(user), validate: (value, user) => isEmpty(value, user), errorMessage: 'Select node', shouldShow: true, fieldInfo: 'info.site.node',
  },
  'configureSite.platformDetails.hostname': {
    label: 'vCenter.server.IP', description: 'vCenter Server IPv4 address', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid IP address', shouldShow: (user) => isPlatformTypeVMware(user), fieldInfo: 'info.site.vcenterhost',
  },
  'configureSite.platformDetails.port': {
    label: 'port', description: 'vCenter Server management port', defaultValue: 443, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Port value required, if different.', shouldShow: (user) => isPlatformTypeVMware(user), fieldInfo: 'info.site.port',
  },
  'configureSite.platformDetails.username': {
    label: 'username', description: 'vCenter Server User Name', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Username required', shouldShow: (user) => isPlatformTypeVMware(user), fieldInfo: 'info.site.vcenter.username',
  },
  'configureSite.platformDetails.password': {
    label: 'password', description: 'vCenter Server User Password', type: FIELD_TYPE.PASSWORD, validate: (value, user) => isEmpty(value, user), errorMessage: 'Password required', shouldShow: (user) => isPlatformTypeVMware(user), fieldInfo: 'info.site.vcenter.password',
  },
  'configureSite.platformDetails.region': {
    label: 'region', description: 'Cloud Site Region where Management Server is deployed and Protection needs to be done', type: FIELD_TYPE.SELECT, errorMessage: 'Region required', shouldShow: (user) => !isPlatformTypeVMware(user), options: (user) => getRegionOptions(user), onChange: (user, dispatch) => updateAvailabilityZones(user, dispatch), fieldInfo: 'info.site.region',
  },
  'configureSite.platformDetails.availZone': {
    label: 'zone', description: 'Availability Zone for Cloud Site where Management Server is deployed and Protection needs to be done', type: FIELD_TYPE.SELECT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Zone required', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user), options: (user) => getAvailibilityZoneOptions(user), fieldInfo: 'info.site.availZone',
  },
  'configureSite.platformDetails.accessKey': {
    label: 'access.key', description: 'Access Key for Cloud Site(AWS)', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Access Key is required', shouldShow: (user) => isPlatformTypeAWS(user), fieldInfo: 'info.site.access.key',
  },
  'configureSite.platformDetails.secretKey': {
    label: 'secret.key', description: 'Secret Key for Cloud Site(AWS)', type: FIELD_TYPE.PASSWORD, validate: (value, user) => isEmpty(value, user), shouldShow: (user) => isPlatformTypeAWS(user), fieldInfo: 'info.site.secrete.key',
  },
  'configureSite.platformDetails.projectId': {
    label: 'project.ID', description: 'Project ID for Cloud Site(GCP)', type: FIELD_TYPE.TEXT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Project ID is required', shouldShow: (user) => isPlatformTypeGCP(user), fieldInfo: 'info.site.gcp.projectid',
  },
  // 'configureSite.platformDetails.serverIp': {
  //   label: 'datamotive.server.IP', description: 'Datamotive Management Server IP', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid IP address', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  // },
  // 'configureSite.platformDetails.serverPort': {
  //   label: 'server.port', description: 'Datamotive service port', defaultValue: 5000, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Server Port is required, if different.', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  // },
  // 'configureSite.platformDetails.prepMachineIP': {
  // label: 'preparation.machine.IP', description: '', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid Machine IP address', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  // },
  'TEST.site.platformName': {
    label: 'Platform Name', description: 'Platform Name for(VMWare/AWS/GCP)', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform name required',
  },

  'drplan.name': {
    label: 'name', description: 'Protection Plan name', type: FIELD_TYPE.TEXT, errorMessage: 'Required disaster recovery plan name', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.protection.plan',
  },
  'drplan.replicationInterval': {
    label: 'Interval', type: FIELD_TYPE.CUSTOM, COMPONENT: REPLICATION_INTERVAL_COMP, validate: (value, user) => validateReplicationInterval(value, user), fieldInfo: 'info.protection.replicationInterval',
  },
  'replication.inerval': { type: FIELD_TYPE.CUSTOM, COMPONENT: REPLICATION_INTERVAL_COMP },
  'drplan.startTime': { label: 'Start Time', description: 'Start date and time for replication', COMPONENT: DATE_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, showTime: true, minDate: true, fieldInfo: 'info.protectionplan.startTime' },
  'drplan.subnet': { label: 'Subnet', description: 'Subnets where Protected Entity will be recovered', placeHolderText: 'Subnet', type: FIELD_TYPE.SELECT, options: (user) => getSubnetOptions(user), errorMessage: 'Select subnet', shouldShow: true, validate: null },
  'drplan.isEncryptionOnWire': { label: 'Encryption On Wire', description: 'Encryption On Wire', type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.protectionplan.encryption.wire' },
  // 'drplan.isEncryptionOnRest': { label: 'Encryption At Rest', description: 'Encryption On Rest', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'drplan.isCompression': { label: 'Compression', description: 'Enable Compression', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: true, fieldInfo: 'info.protectionplan.isCompression' },
  'drplan.isDedupe': { label: 'Dedupe', description: 'Enable De-Duplication', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, fieldInfo: 'info.protectionplan.isDedupe' },
  'drplan.enableReverse': { label: 'Differential Reverse Replication', description: 'Enable For Reverse', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, fieldInfo: 'info.protectionplan.enable.reverse' },
  'drplan.preScript': { label: 'Pre Script', description: 'Pre Script to execute before Recovery', placeHolderText: 'Pre Script to execute before Recovery', type: FIELD_TYPE.SELECT, options: (user) => getPreScriptsOptions(user), errorMessage: 'Select pre script', shouldShow: true, fieldInfo: 'info.protectionplan.preScript' },
  'drplan.postScript': { label: 'Post Script', description: 'Post Script to execute post Recovery', placeHolderText: 'Post Script to execute post Recovery', type: FIELD_TYPE.SELECT, options: (user) => getPostScriptsOptions(user), errorMessage: 'Select post script', shouldShow: true, fieldInfo: 'info.protectionplan.postScript' },

  'drplan.scriptTimeout': {
    label: 'Script Timeout', description: 'Script timeout in seconds', type: FIELD_TYPE.NUMBER, errorMessage: 'Script Timeout is not valid', shouldShow: true, defaultValue: 300, fieldInfo: 'info.protectionplan.scriptTimeout',
  },
  'drplan.bootDelay': {
    label: 'boot.delay', description: 'Boot delay between two boot orders in seconds', type: FIELD_TYPE.NUMBER, errorMessage: 'Boot delay is not valid', shouldShow: true, defaultValue: 0, fieldInfo: 'info.protectionplan.boot.delay',
  },
  'drplan.retryCount': {
    label: 'retry.count', description: 'Retry Count, if specified action is failed', type: FIELD_TYPE.NUMBER, errorMessage: 'Retry Count not valid(must be a integer)', shouldShow: true, fieldInfo: 'info.protectionplan.retry.count',
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
    label: 'protect.site', description: 'Source/Protected Site', placeHolderText: 'Protect Site', type: FIELD_TYPE.SELECT, options: (user) => getSitesOptions(user), errorMessage: 'Select protection site. Protection and recovery sites cannot be same.', shouldShow: true, validate: (user) => validateDrSiteSelection(user), onChange: (user, dispatch) => onProtectSiteChange(user, dispatch), fieldInfo: 'info.protectionplan.protectedSite',
  },
  'drplan.recoverySite': {
    label: 'recovery.site', description: 'Target/Recovery Site', placeHolderText: 'Recovery Site', type: FIELD_TYPE.SELECT, options: (user) => getSitesOptions(user), errorMessage: 'Select recovery site. Recovery and protection sites cannot be same.', shouldShow: true, validate: (user) => validateDrSiteSelection(user), onChange: (user, dispatch) => onRecoverSiteChange(user, dispatch), fieldInfo: 'info.protectionplan.recoverySite',
  },
  'drplan.recoveryEntities.name': { label: 'recoveryentitites.name', description: 'Name for Recovery Entities', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: false },
  'drplan.protectedEntities.Name': { label: 'protectedentities.name', description: 'Name for Protected Entities', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: false },
  'recovery.protectionplanID': { label: 'protection.plan', description: ' Select Protection Plan ', placeHolderText: '', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (user) => getDRPlanOptions(user), onChange: (user, dispatch) => onProtectionPlanChange(user, dispatch) },
  'recovery.dryrun': { label: 'dry.run', description: 'Test recovery flag, check for true', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, validate: null, errorMessage: '', shouldShow: true, defaultValue: true },
  // 'recovery.winUser': { label: 'machine.username', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: true },
  // 'recovery.winPassword': { label: 'machine.password', placeHolderText: '', type: FIELD_TYPE.PASSWORD, validate: null, errorMessage: '', shouldShow: true },
  'recovery.vmNames': { label: 'recovery.names', description: 'List of VM names which are needed to recover', placeHolderText: '', type: FIELD_TYPE.PASSWORD, validate: null, errorMessage: '', shouldShow: false },
  'recovery.installSystemAgent': { label: 'recovery.installSystemAgent', description: 'Install System Agents', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, validate: null, errorMessage: '', shouldShow: true, defaultValue: false, fieldInfo: 'info.recovery.system.agent' },
  'recovery.installCloudPkg': { label: 'recovery.installCloudPkg', description: 'Install Cloud Packages', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, validate: null, errorMessage: '', shouldShow: true, defaultValue: false, fieldInfo: 'info.recovery.install.cloud.packages' },
  'ui.values.replication.interval.type': {
    label: 'Unit', description: 'Replication interval i.e time gap after which next iteration will start after previous one is completed/failed', placeHolderText: 'Select replication unit', type: FIELD_TYPE.SELECT, options: [{ label: 'Days', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_DAY }, { label: 'Hours', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_HOUR }, { label: 'Minutes', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_MIN }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Invalid replication interval.', shouldShow: true, defaultValue: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_MIN,
  },
  'ui.values.replication.interval.days': {
    label: 'Days', description: '', placeHolderText: '', type: FIELD_TYPE.SELECT, options: (user) => getReplicationUnitDays(user), validate: (value, user) => isEmpty(value, user), errorMessage: 'Invalid replication interval.', shouldShow: true, defaultValue: 0,
  },
  'ui.values.replication.interval.hours': {
    label: 'Hours', description: '', placeHolderText: '', type: FIELD_TYPE.SELECT, options: (user) => getReplicationUnitHours(user), validate: (value, user) => isEmpty(value, user), errorMessage: 'Invalid replication interval.', shouldShow: true, defaultValue: 0,
  },
  'ui.values.replication.interval.min': {
    label: 'Minutes', description: '', placeHolderText: '', type: FIELD_TYPE.SELECT, options: (user) => getReplicationUnitMins(user), validate: (value, user) => validateReplicationValue(value, user), errorMessage: 'Invalid replication interval.', shouldShow: true, defaultValue: 0,
  },
  // Node Fields
  'node.name': {
    label: 'node.name', description: 'Node name', placeHolderText: 'name', type: FIELD_TYPE.TEXT, errorMessage: 'Enter name for the node', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.node.name' },
  'node.hostname': {
    label: 'node.hostname', description: 'Enter FQDN or IP Address', patterns: [FQDN_REGEX, IP_REGEX], placeHolderText: 'FQDN or IP', type: FIELD_TYPE.TEXT, errorMessage: 'Enter FQDN or IP Address', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.node.hostname' },
  'node.username': {
    label: 'node.username', description: 'Enter node username', placeHolderText: 'Username', type: FIELD_TYPE.TEXT, errorMessage: 'Enter node username', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.node.username' },
  'node.password': {
    label: 'node.password', description: 'Enter node password', placeHolderText: 'Password', type: FIELD_TYPE.PASSWORD, errorMessage: 'Enter node password', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.node.password' },
  'node.nodeType': {
    label: 'node.nodeType', description: 'Select node type.', placeHolderText: 'Node type', type: FIELD_TYPE.SELECT, errorMessage: 'Select node type', shouldShow: true, validate: (value, user) => isEmpty(value, user), options: (user) => getNodeTypeOptions(user), fieldInfo: 'info.node.type' },
  'node.platformType': {
    label: 'node.platformType', description: 'Select platform type.', placeHolderText: 'Platform type', type: FIELD_TYPE.SELECT, errorMessage: 'Select platform type', shouldShow: (user) => shouldShowNodePlatformType(user), validate: (value, user) => isEmpty(value, user), options: (user) => getPlatformTypeOptions(user), fieldInfo: 'info.node.platformType' },
  'node.managementPort': {
    label: 'node.managementPort', description: 'Node management port', defaultValue: 5000, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Port value required', shouldShow: (user) => shouldShowNodeManagementPort(user), fieldInfo: 'info.node.mgmt.port',
  },
  'node.replicationDataPort': {
    label: 'node.replicationDataPort', description: 'Node replication data port', defaultValue: 5001, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Port value required', shouldShow: (user) => shouldShowNodeReplicationPort(user), fieldInfo: 'info.node.replicationCtrlPort',
  },
  'node.replicationCtrlPort': {
    label: 'node.replicationCtrlPort', description: 'Node replication https port', defaultValue: 5003, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Port value required', shouldShow: (user) => shouldShowNodeReplicationPort(user), fieldInfo: 'info.node.replicationDataPort',
  },
  'node.encryptionKey': {
    label: 'node.encryptionKey', description: 'Node encryption key', placeHolderText: 'encryption key', type: FIELD_TYPE.TEXT, errorMessage: 'Enter encryption key for the node', shouldShow: (user) => shouldShowNodeEncryptionKey(user), fieldInfo: 'info.node.encryption.key' },
  // email configurations
  'emailConfiguration.emailAddress': {
    label: 'emailConfiguration.emailAddress', description: 'Email address', placeHolderText: 'Email address', type: FIELD_TYPE.TEXT, errorMessage: 'Enter valid email address', shouldShow: true, patterns: [EMAIL_REGEX], fieldInfo: 'info.email.address' },
  'emailConfiguration.password': {
    label: 'emailConfiguration.password', description: 'Email password', placeHolderText: 'Email password', type: FIELD_TYPE.PASSWORD, errorMessage: 'Enter email password', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.email.password' },
  'emailConfiguration.smtpHost': {
    label: 'emailConfiguration.smtpHost', description: 'SMTP host name', placeHolderText: 'SMTP host name', type: FIELD_TYPE.TEXT, errorMessage: 'Enter valid smtp host or ip address', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.email.smtp.host' },
  'emailConfiguration.smtpPort': {
    label: 'emailConfiguration.smtpPort', description: 'SMTP port', placeHolderText: 'SMTP port', type: FIELD_TYPE.NUMBER, errorMessage: 'Enter valid smtp port', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.email.smpt.port' },
  'emailConfiguration.insecureSkipVerify': {
    label: 'emailConfiguration.insecureSkipVerify', description: 'Skip SSL certificate', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.email.skip.ssl' },
  'emailConfiguration.replicateConfig': {
    label: 'emailConfiguration.replicateConfig', description: 'Replicate configuration on connected sites', placeHolderText: 'Replicate configuration on connected sites', type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.email.replicate.config' },
  'emailRecipient.emailAddress': {
    label: 'emailRecipient.emailAddress', description: 'Email address of recipient', placeHolderText: 'Email address of recipient', type: FIELD_TYPE.TEXT, shouldShow: true, errorMessage: 'Enter valid email address', patterns: [EMAIL_REGEX], fieldInfo: 'info.email.recipient.address' },
  'emailRecipient.subscribedEvents': {
    label: 'emailRecipient.subscribedEvents', description: 'Subscribed events for email address', placeHolderText: 'Subscribed events for email address', COMPONENT: MULTISELECT_ITEM_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, errorMessage: 'Select at least one event type', validate: (value, user) => isEmpty(value, user), options: (user) => getEventOptions(user), fieldInfo: 'info.email.recipient.event' },
  // Report
  // 'report.startDate': { label: 'report.startDate', description: 'Starting date for report', COMPONENT: DATE_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  // 'report.endDate': { label: 'report.endDate', description: 'End date for report', COMPONENT: DATE_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  'report.system.includeSystemOverView': { label: 'report.includeSystemOverView', description: 'Add protected virtual machines in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.system.includeNodes': { label: 'report.includeNodes', description: 'Add nodes in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.system.includeEvents': { label: 'report.includeEvents', description: 'Add events in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.system.includeAlerts': { label: 'report.includeAlerts', description: 'Add alerts in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.protectionPlan.protectionPlans': { label: 'report.protectionPlans', description: 'Select protection plan for report', type: FIELD_TYPE.SELECT, shouldShow: true, options: (user) => getReportProtectionPlans(user), defaultValue: 0 },
  // 'report.protectionPlan.sites': { label: 'Sites', description: 'Include sites in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: true },
  'report.protectionPlan.includeProtectedVMS': { label: 'report.includeProtectedVMS', description: 'Add sites in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.protectionPlan.includeReplicationJobs': { label: 'report.includeReplicationJobs', description: 'Add replication jobs in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.protectionPlan.includeRecoveryJobs': { label: 'report.includeRecoveryJobs', description: 'Add recovery jobs in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  // Reverse
  'reverse.name': { label: 'name', placeHolderText: 'Name', type: FIELD_TYPE.LABEL, shouldShow: true },
  'reverse.protectedSite': { label: 'protect.site', placeHolderText: 'Protect Site', type: FIELD_TYPE.LABEL, shouldShow: true },
  'reverse.recoverySite': { label: 'recovery.site', placeHolderText: 'Recovery Site', type: FIELD_TYPE.SELECT, options: (user) => getSitesOptions(user), errorMessage: 'Select recovery site. Recovery and protection sites cannot be same.', shouldShow: true, validate: (user) => validateDrSiteSelection(user), defaultValue: (user) => getDefaultRecoverySite(user) },
  'reverse.replType': { label: 'reverse.replType', type: FIELD_TYPE.SELECT, errorMessage: 'Replication type required', shouldShow: true, options: [{ label: 'Full Incremental', value: STATIC_KEYS.FULL_INCREMENTAL }, { label: 'Differential', value: STATIC_KEYS.DIFFERENTIAL }], defaultValue: STATIC_KEYS.DIFFERENTIAL },
  'reverse.interval': { label: 'replication.interval', placeHolderText: 'Replication Interval', type: FIELD_TYPE.LABEL, shouldShow: true },
  'reverse.suffix': { label: 'reverse.suffix', placeHolderText: 'Recovery Machines Suffix', type: FIELD_TYPE.TEXT, shouldShow: true, validate: (value, user) => isEmpty(value, user), errorMessage: 'Recovery machines suffix is required' },
  // Throttling
  'throttling.isLimitEnabled': { label: 'throttling.isLimitEnabled', description: 'Enable Bandwidth Limit', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, onChange: (user, dispatch) => onLimitChange(user, dispatch) },
  'throttling.bandwidthLimit': { label: 'throttling.bandwidthLimit', description: 'Bandwidth in Mbps', defaultValue: 0, min: 0, max: 1000, type: FIELD_TYPE.RANGE, errorMessage: 'Bandwidth is required', shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  'throttling.applyToAll': { label: 'throttling.applyToAll', description: 'Apply To All Replication Nodes', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: true },
  'throttling.startTime': { label: 'throttling.startTime', description: 'Bandwidth Throttling Start Time', COMPONENT: TIME_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  'throttling.endTime': { label: 'throttling.endTime', description: 'Bandwidth Throttling End Time', COMPONENT: TIME_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  'throttling.isTimeEnabled': { label: 'throttling.isTimeEnabled', description: 'Enable Bandwidth Time Limit', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, onChange: (user, dispatch) => onTimeLimitChange(user, dispatch) },
  'throttling.timeLimit': { label: 'throttling.timeLimit', description: 'Bandwidth in Mbps', defaultValue: 0, min: 0, max: 1000, type: FIELD_TYPE.RANGE, errorMessage: 'Bandwidth is required', shouldShow: true, validate: (value, user) => isEmpty(value, user) },
};
