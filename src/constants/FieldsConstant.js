import i18n from 'i18next';
import { errorMessageForReasonInReplOp } from '../utils/AppUtils';
import { onNodeTypeChange, onPlatformTypeChange } from '../store/actions';
import { onProtectionPlanChange } from '../store/actions/DrPlanActions';
import { onProtectSiteChange, updateAvailabilityZones } from '../store/actions/SiteActions';
import { onLimitChange, onTimeLimitChange } from '../store/actions/ThrottlingAction';
import { loadTreeChildData, onDiffReverseChanges, onScriptChange } from '../store/actions/UserActions';
import { commonCheckpointOptions, defaultRecoveryCheckpointForVm, disableSiteSelection, enableNodeTypeVM, getAvailibilityZoneOptions, getCheckpointDurationOption, getCheckRentaintionOption, getDefaultRecoverySite, getDRPlanOptions, getEventOptions, getNodeTypeOptions, getPlatformTypeOptions, getPostScriptsOptions, getPreScriptsOptions, getRegionOptions, getReplicationUnitDays, getReplicationUnitHours, getReplicationUnitMins, getReportProtectionPlans, getSiteNodeOptions, getSitesOptions, getSubnetOptions, getVmCheckpointOptions, getVMwareVMSelectionData, isPlatformTypeAWS, isPlatformTypeAzure, isPlatformTypeGCP, isPlatformTypeVMware, onCommonCheckpointChange, onVmRecoveryCheckpointOptionChange, revShowRemoveCheckpointOption, shouldShowNodeGatewayIP, shouldShowNodeManagementPort, shouldShowNodePlatformType, shouldShowNodeReplicationPort, showDifferentialReverseCheckbox, showInstallCloudPackageOption, showRecipientEmailField, showRecoveryOption, showReplOption, showRevPrefix, userRoleOptions } from '../utils/InputUtils';
import { getErrorMessage, getFieldInfo, getLabel } from '../utils/LocallUtils';
import { defaultReportScheduleTimeZone, getMinMaxForReportSchedulerMaintanance, getMinMaxForReportSchedulerOccurence, getReportDurationOptions, getTimeZoneOptions, onReportOccurrenceChange, setMinDateForReport, showReportDayOfMonthField, showReportDurationDate } from '../utils/ReportUtils';
import { defaultEntityTypeForVm, defaultReplicationTypeForVm, getVmEntityTypeOptions, getVmReplicationTypeOptions, hasWarning } from '../utils/ReverseReplicationUtils';
import { disableRecoveryCheckpointField, isEmpty, isGatewayValid, showReverseWarningText, validateCheckpointFields, validateDrSiteSelection, validatePassword, validatePlanSiteSelection, validateReplicationInterval, validateReplicationValue } from '../utils/validationUtils';
import { CONSTANT_NUMBERS, STATIC_KEYS } from './InputConstants';
import { EMAIL_REGEX, FQDN_REGEX, HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX, IP_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from './ValidationConstants';

export const CONFIURE_SITE_GROUP = ['configureSite.platformDetails.type', 'configureSite.platformDetails.platformName'];
export const REPLICATION_INTERVAL_COMP = 'REPLICATION_INTERVAL_COMP';
export const MULTISELECT_ITEM_COMP = 'MULTISELECT_ITEM_COMP';
export const DATE_PICKER_COMP = 'DATE_PICKER';
export const REPORT_PRTECTION_PLAN_COMP = 'REPORT_PRTECTION_PLAN_COMP';
export const TIME_PICKER_COMP = 'TIME_PICKER';
export const STACK_VIEW_COMPONENT = 'STACK_VIEW_COMPONENT';
export const PROTECTION_REPLICATION_JOBS = 'PROTECTION_REPLICATION_JOBS';
export const FIELD_TYPE = {
  CHECKBOX: 'CHECKBOX', TEXT: 'TEXT', SELECT: 'SELECT', SELECT_SEARCH: 'SELECT_SEARCH', NUMBER: 'NUMBER', PASSWORD: 'PASSWORD', CUSTOM: 'CUSTOM', RADIO: 'RADIO', RANGE: 'RANGE', TREE: 'TREE', STATICTEXT: 'STATICTEXT', TEXTLABEL: 'TEXTLABEL',
};
export const FIELDS = {

  'configureSite.name': {
    label: 'site.name', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Site name required', shouldShow: true, fieldInfo: 'info.site.name',
  },
  'configureSite.description': {
    label: 'description', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Site Description Required', shouldShow: true, fieldInfo: 'info.site.description',
  },
  'configureSite.siteType': {
    label: 'site.type', placeHolderText: 'Select Site', type: FIELD_TYPE.SELECT, options: [{ label: 'Protection', value: 'Protection' }, { label: 'Recover', value: 'Recovery' }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Site type required', shouldShow: true, fieldInfo: 'info.site.type',
  },
  'configureSite.platformDetails.platformType': {
    label: 'platform.type', type: FIELD_TYPE.SELECT, options: [{ label: 'VMware', value: 'VMware' }, { label: 'AWS', value: 'AWS' }, { label: 'GCP', value: 'GCP' }, { label: 'Azure', value: 'Azure' }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform Type required', shouldShow: true, onChange: (user, dispatch) => onPlatformTypeChange(user, dispatch), fieldInfo: 'info.site.platform.type',
  },
  'configureSite.node': {
    label: 'site.node', type: FIELD_TYPE.SELECT, options: (user) => getSiteNodeOptions(user), validate: (value, user) => isEmpty(value, user), errorMessage: 'Select node', shouldShow: true, fieldInfo: 'info.site.node',
  },
  'configureSite.platformDetails.region': {
    label: 'region', type: FIELD_TYPE.SELECT, errorMessage: 'Region required', validate: (value, user) => isEmpty(value, user), shouldShow: (user) => !isPlatformTypeVMware(user), options: (user) => getRegionOptions(user), onChange: (user, dispatch) => updateAvailabilityZones(user, dispatch), fieldInfo: 'info.site.region',
  },
  'configureSite.platformDetails.availZone': {
    label: 'zone', type: FIELD_TYPE.SELECT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Zone required', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user), options: (user) => getAvailibilityZoneOptions(user), fieldInfo: 'info.site.availZone',
  },
  'configureSite.platformDetails.projectId': {
    label: 'project.ID', labelFunction: ({ user, fieldKey, label }) => getLabel({ user, fieldKey, label }), type: FIELD_TYPE.TEXT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Project ID is required', errorFunction: ({ user, fieldKey }) => getErrorMessage({ user, fieldKey }), shouldShow: (user) => isPlatformTypeGCP(user) || isPlatformTypeAzure(user), fieldInfo: 'info.site.gcp.projectid', infoFunction: (user, fieldKey) => getFieldInfo({ user, fieldKey }),

  },
  'configureSite.platformDetails.hostname': {
    label: 'vCenter.server.IP', type: FIELD_TYPE.TEXT, errorMessage: 'Enter valid IP/hostname', patterns: [IP_REGEX, FQDN_REGEX], shouldShow: (user) => isPlatformTypeVMware(user), fieldInfo: 'info.site.vcenterhost',
  },
  'configureSite.platformDetails.storageAccount': {
    label: 'storage.account', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Storage Account is required', shouldShow: (user) => isPlatformTypeAzure(user), fieldInfo: 'info.site.storage.acc',
  },
  'configureSite.platformDetails.tenantId': {
    label: 'tenant.id', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Tenant ID is required', shouldShow: (user) => isPlatformTypeAzure(user), fieldInfo: 'info.site.storage.tenant.id',
  },
  'configureSite.platformDetails.clientId': {
    label: 'client.id', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Client ID is required', shouldShow: (user) => isPlatformTypeAzure(user), fieldInfo: 'info.site.storage.client.id',
  },
  'configureSite.platformDetails.port': {
    label: 'port', defaultValue: 443, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Port value required, if different.', shouldShow: (user) => isPlatformTypeVMware(user), fieldInfo: 'info.site.port',
  },
  'configureSite.platformDetails.username': {
    label: 'username', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Username required', shouldShow: (user) => isPlatformTypeVMware(user), fieldInfo: 'info.site.vcenter.username', infoFunction: (user, fieldKey) => getFieldInfo({ user, fieldKey }),
  },
  'configureSite.platformDetails.password': {
    label: 'password', type: FIELD_TYPE.PASSWORD, validate: (value, user) => isEmpty(value, user), errorMessage: 'Password required', shouldShow: (user) => isPlatformTypeVMware(user), fieldInfo: 'info.site.vcenter.password', infoFunction: (user, fieldKey) => getFieldInfo({ user, fieldKey }),
  },
  'configureSite.platformDetails.accessKey': {
    label: 'access.key', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Access Key is required', shouldShow: (user) => isPlatformTypeAWS(user), fieldInfo: 'info.site.access.key',
  },
  'configureSite.platformDetails.secretKey': {
    label: 'secret.key', type: FIELD_TYPE.PASSWORD, validate: (value, user) => isEmpty(value, user), shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeAzure(user), fieldInfo: 'info.site.secrete.key', errorMessage: 'Secret key is required.',
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
    label: 'Platform Name', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform name required',
  },

  'drplan.name': {
    label: 'name', type: FIELD_TYPE.TEXT, errorMessage: 'Required protection plan name', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.protection.plan',
  },
  'drplan.replicationInterval': {
    label: 'Interval', type: FIELD_TYPE.CUSTOM, COMPONENT: REPLICATION_INTERVAL_COMP, validate: (value, user) => validateReplicationInterval(value, user), fieldInfo: 'info.protection.replicationInterval',
  },
  'replication.inerval': { type: FIELD_TYPE.CUSTOM, COMPONENT: REPLICATION_INTERVAL_COMP },
  'drplan.startTime': { label: 'Start Time', COMPONENT: DATE_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, showTime: true, minDate: true, fieldInfo: 'info.protectionplan.startTime' },
  'drplan.subnet': { label: 'Subnet', placeHolderText: 'Subnet', type: FIELD_TYPE.SELECT, options: (user) => getSubnetOptions(user), errorMessage: 'Select subnet', shouldShow: true, validate: null },
  'drplan.isEncryptionOnWire': { label: 'Encryption On Wire', type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.protectionplan.encryption.wire' },
  // 'drplan.isEncryptionOnRest': { label: 'Encryption At Rest', description: 'Encryption On Rest', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'drplan.isCompression': { label: 'Compression', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: true, fieldInfo: 'info.protectionplan.isCompression' },
  'drplan.isDedupe': { label: 'Dedupe', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, fieldInfo: 'info.protectionplan.isDedupe' },
  'drplan.reverseWarningText': { type: FIELD_TYPE.TEXTLABEL, shouldShow: (user, fieldKey) => showReverseWarningText(user, fieldKey), text: i18n.t('vmware.diff.rev.warning') },
  'drplan.enableDifferentialReverse': { label: 'Differential Reverse Replication', type: FIELD_TYPE.CHECKBOX, shouldShow: (user) => showDifferentialReverseCheckbox(user), defaultValue: false, fieldInfo: 'info.protectionplan.enable.reverse', onChange: ({ value }) => onDiffReverseChanges({ value }) },
  'drplan.enablePPlanLevelScheduling': { label: 'Synchronize All VM Replications', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, fieldInfo: 'info.protectionplan.enable.replication.scheduling' },
  'drplan.replPreScript': { label: 'Pre Script', placeHolderText: 'Pre Script to execute before Replication', type: FIELD_TYPE.SELECT, options: (user) => getPreScriptsOptions(user), errorMessage: 'Select replication pre script', shouldShow: true, fieldInfo: 'info.protectionplan.replPreScript', onChange: (user, dispatch) => onScriptChange(user, dispatch) },
  'drplan.replPostScript': { label: 'Post Script', placeHolderText: 'Post Script to execute post Replication', type: FIELD_TYPE.SELECT, options: (user) => getPostScriptsOptions(user), errorMessage: 'Select replication post script', shouldShow: true, fieldInfo: 'info.protectionplan.replPostScript', onChange: (user, dispatch) => onScriptChange(user, dispatch) },
  'drplan.preScript': { label: 'Pre Script', fieldInfo: 'info.protectionplan.postScript', placeHolderText: 'Pre Script to execute before Recovery', type: FIELD_TYPE.SELECT, options: (user) => getPreScriptsOptions(user), errorMessage: 'Select recovery pre script', shouldShow: true, onChange: (user, dispatch) => onScriptChange(user, dispatch) },
  'drplan.postScript': { label: 'Post Script', fieldInfo: 'info.protectionplan.postScript', placeHolderText: 'Post Script to execute post Recovery', type: FIELD_TYPE.SELECT, options: (user) => getPostScriptsOptions(user), errorMessage: 'Select recovery post script', shouldShow: true, onChange: (user, dispatch) => onScriptChange(user, dispatch) },
  'drplan.preInputs': { label: 'Pre Script Inputs', fieldInfo: 'info.protectionplan.scriptInput', type: FIELD_TYPE.TEXT, placeHolderText: 'input params', shouldShow: true },
  'drplan.postInputs': { label: 'Post Script Inputs', fieldInfo: 'info.protectionplan.scriptInput', type: FIELD_TYPE.TEXT, placeHolderText: 'input params', shouldShow: true },
  'drplan.scriptTimeout': {
    label: 'Script Timeout', type: FIELD_TYPE.NUMBER, errorMessage: 'Script Timeout is not valid', shouldShow: true, defaultValue: 300, fieldInfo: 'info.protectionplan.scriptTimeout',
  },
  'drplan.bootDelay': {
    label: 'boot.delay', type: FIELD_TYPE.NUMBER, errorMessage: 'Boot delay is not valid', shouldShow: true, defaultValue: 0, fieldInfo: 'info.protectionplan.boot.delay',
  },
  'recoveryPointConfiguration.isRecoveryCheckpointEnabled': { label: 'Data management', type: FIELD_TYPE.CHECKBOX, fieldInfo: "Enables user to maintain snapshot copies of replicated data which is useful in case of ransomware attacks as with this configuration user will be able to go back to it's previous snapshot and recover from that snapshot", errorMessage: '.', disabled: (user) => disableRecoveryCheckpointField(user), shouldShow: true },
  'recoveryPointConfiguration.duration.number': { type: FIELD_TYPE.NUMBER, min: 0, errorMessage: '.', validate: ({ value, user }) => validateCheckpointFields(value, user), disabled: (user) => disableRecoveryCheckpointField(user), shouldShow: true },
  'recoveryPointConfiguration.duration': { label: 'Checkpoint Duration', shouldShow: true, type: FIELD_TYPE.SELECT, options: (user, fieldKey) => getCheckpointDurationOption(user, fieldKey), validate: ({ value, user }) => validateCheckpointFields(value, user), errorMessage: 'Select volume type.', disabled: (user) => disableRecoveryCheckpointField(user) },
  'recoveryPointConfiguration.count': { label: '', shouldShow: true, type: FIELD_TYPE.NUMBER, min: 0, hideLabel: true, validate: ({ value, user }) => validateCheckpointFields(value, user), errorMessage: '.', disabled: (user) => disableRecoveryCheckpointField(user) },
  'recoveryPointConfiguration.retain.number': { type: FIELD_TYPE.NUMBER, min: 0, shouldShow: true, errorMessage: '.', validate: ({ value, user }) => validateCheckpointFields(value, user), disabled: (user) => disableRecoveryCheckpointField(user) },
  'recoveryPointConfiguration.retainfor': { label: 'Retain For', shouldShow: true, type: FIELD_TYPE.SELECT, options: (user, fieldKey) => getCheckRentaintionOption(user, fieldKey), validate: ({ value, user }) => validateCheckpointFields(value, user), errorMessage: '.', disabled: (user) => disableRecoveryCheckpointField(user) },
  'drplan.retryCount': {
    label: 'retry.count', type: FIELD_TYPE.NUMBER, errorMessage: 'Retry Count not valid(must be a integer)', shouldShow: true, fieldInfo: 'info.protectionplan.retry.count',
  },
  'drplan.failureActions': {
    label: 'failure.actions', type: FIELD_TYPE.TEXT, errorMessage: 'Failure Action needs to be specified', shouldShow: true, validate: (value, user) => isEmpty(value, user),
  },
  'drplan.throttleTime': {
    label: 'throttle.time', type: FIELD_TYPE.TEXT, errorMessage: 'Invalid value for throttle time', shouldShow: true, validate: (value, user) => isEmpty(value, user),
  },
  'drplan.throttleBandwidth': {
    label: 'throttle.bandwidth', type: FIELD_TYPE.NUMBER, errorMessage: 'Invalid value for throttle bandwidth', shouldShow: true,
  },
  'drplan.protectedSite': {
    label: 'protect.site', placeHolderText: 'Protect Site', type: FIELD_TYPE.SELECT, options: (user, fieldKey) => getSitesOptions(user, fieldKey), errorMessage: 'Please select Protected Site', shouldShow: true, validate: (user) => validateDrSiteSelection(user), onChange: (user, dispatch) => onProtectSiteChange(user, dispatch), fieldInfo: 'info.protectionplan.protectedSite', disabled: (user) => disableSiteSelection(user), errorFunction: ({ user, value, fieldKey }) => validatePlanSiteSelection({ user, value, fieldKey }),
  },
  'drplan.recoverySite': {
    label: 'recovery.site', placeHolderText: 'Recovery Site', type: FIELD_TYPE.SELECT, options: (user, fieldKey) => getSitesOptions(user, fieldKey), errorMessage: 'Please select Recovery site', shouldShow: true, validate: (user) => validateDrSiteSelection(user), fieldInfo: 'info.protectionplan.recoverySite', disabled: (user) => disableSiteSelection(user), errorFunction: ({ user, value, fieldKey }) => validatePlanSiteSelection({ user, value, fieldKey }),
  },
  'drplan.recoveryEntities.name': { label: 'recoveryentitites.name', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: false },
  'drplan.protectedEntities.Name': { label: 'protectedentities.name', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: false },
  'recovery.protectionplanID': { label: 'protection.plan', placeHolderText: '', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (user) => getDRPlanOptions(user), onChange: (user, dispatch) => onProtectionPlanChange(user, dispatch) },
  'recovery.dryrun': { label: 'dry.run', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, validate: null, errorMessage: '', shouldShow: true, defaultValue: true },
  // 'recovery.winUser': { label: 'machine.username', placeHolderText: '', type: FIELD_TYPE.TEXT, validate: null, errorMessage: '', shouldShow: true },
  // 'recovery.winPassword': { label: 'machine.password', placeHolderText: '', type: FIELD_TYPE.PASSWORD, validate: null, errorMessage: '', shouldShow: true },
  'recovery.vmNames': { label: 'recovery.names', placeHolderText: '', type: FIELD_TYPE.PASSWORD, validate: null, errorMessage: '', shouldShow: false },
  'recovery.installSystemAgent': { label: 'recovery.installSystemAgent', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, validate: null, errorMessage: '', defaultValue: false, fieldInfo: 'info.recovery.system.agent' },
  'recovery.installCloudPkg': { label: 'recovery.installCloudPkg', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, validate: null, errorMessage: '', shouldShow: (u) => showInstallCloudPackageOption(u), defaultValue: false, fieldInfo: 'info.recovery.install.cloud.packages' },
  'recovery.removeFromAD': { label: 'recovery.removeFromAD', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, validate: null, errorMessage: '', shouldShow: true, defaultValue: false, fieldInfo: 'info.recovery.remove.windows.ad' },
  'ui.values.replication.interval.type': {
    label: 'Unit', placeHolderText: 'Select replication unit', type: FIELD_TYPE.SELECT, options: [{ label: 'Days', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_DAY }, { label: 'Hours', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_HOUR }, { label: 'Minutes', value: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_MIN }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Invalid replication interval.', shouldShow: true, defaultValue: STATIC_KEYS.REPLICATION_INTERVAL_TYPE_MIN,
  },
  'ui.values.replication.interval.days': {
    label: 'Days', placeHolderText: '', type: FIELD_TYPE.SELECT, options: (user) => getReplicationUnitDays(user), validate: (value, user) => isEmpty(value, user), errorMessage: 'Invalid replication interval.', shouldShow: true, defaultValue: 0,
  },
  'ui.values.replication.interval.hours': {
    label: 'Hours', placeHolderText: '', type: FIELD_TYPE.SELECT, options: (user) => getReplicationUnitHours(user), validate: (value, user) => isEmpty(value, user), errorMessage: 'Invalid replication interval.', shouldShow: true, defaultValue: 0,
  },
  'ui.values.replication.interval.min': {
    label: 'Minutes', placeHolderText: '', type: FIELD_TYPE.SELECT, options: (user) => getReplicationUnitMins(user), validate: (value, user) => validateReplicationValue(value, user), errorMessage: 'Invalid replication interval.', shouldShow: true, defaultValue: 0,
  },
  // Node Fields
  'node.name': {
    label: 'node.name', placeHolderText: 'name', type: FIELD_TYPE.TEXT, errorMessage: 'Enter name for the node', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.node.name' },
  'node.hostname': {
    label: 'node.hostname', patterns: [FQDN_REGEX, IP_REGEX], placeHolderText: 'FQDN or IP', type: FIELD_TYPE.TEXT, errorMessage: 'Enter FQDN or IP Address', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.node.hostname' },
  'node.username': {
    label: 'node.username', placeHolderText: 'Username', type: FIELD_TYPE.TEXT, errorMessage: 'Enter node username', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.node.username' },
  'node.password': {
    label: 'node.password', placeHolderText: 'Password', type: FIELD_TYPE.PASSWORD, errorMessage: 'Enter node password', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.node.password' },
  'node.nodeType': {
    label: 'node.nodeType', placeHolderText: 'Node type', type: FIELD_TYPE.SELECT, errorMessage: 'Select node type', shouldShow: true, validate: (value, user) => isEmpty(value, user), options: (user) => getNodeTypeOptions(user), fieldInfo: 'info.node.type', onChange: ({ value, fieldKey }) => onNodeTypeChange({ value, fieldKey }) },
  'node.platformType': {
    label: 'node.platformType', placeHolderText: 'Platform type', type: FIELD_TYPE.SELECT, errorMessage: 'Select platform type', shouldShow: (user) => shouldShowNodePlatformType(user), validate: (value, user) => isEmpty(value, user), options: (user) => getPlatformTypeOptions(user), fieldInfo: 'info.node.platformType' },
  'node.managementPort': {
    label: 'node.managementPort', defaultValue: 5000, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Port value required', shouldShow: (user) => shouldShowNodeManagementPort(user), fieldInfo: 'info.node.mgmt.port',
  },
  'node.replicationDataPort': {
    label: 'node.replicationDataPort', defaultValue: 5001, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Port value required', shouldShow: (user) => shouldShowNodeReplicationPort(user), fieldInfo: 'info.node.replicationDataPort',
  },
  'node.replicationCtrlPort': {
    label: 'node.replicationCtrlPort', defaultValue: 5003, min: 1, max: 65536, type: FIELD_TYPE.NUMBER, errorMessage: 'Port value required', shouldShow: (user) => shouldShowNodeReplicationPort(user), fieldInfo: 'info.node.replicationCtrlPort',
  },
  'node.isBehindGateway': {
    label: 'node.isBehindGateway', defaultValue: false, type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.node.isBehindGateway',
  },
  'node.gatewayIP': {
    label: 'node.gatewayIP', defaultValue: '', type: FIELD_TYPE.TEXT, shouldShow: (user) => shouldShowNodeGatewayIP(user), fieldInfo: 'info.node.gatewayIP', validate: (value, user) => isGatewayValid(value, user), errorMessage: 'Provide gateway/DNAT hostname/ip address',
  },
  'node.encryptionKey': {
    label: 'node.encryptionKey', placeHolderText: 'encryption key', type: FIELD_TYPE.TEXT, errorMessage: 'Enter encryption key for the node', shouldShow: false, fieldInfo: 'info.node.encryption.key' },
  // email configurations
  'emailConfiguration.emailAddress': {
    label: 'emailConfiguration.emailAddress', placeHolderText: 'Email address', type: FIELD_TYPE.TEXT, errorMessage: 'Enter valid email address', shouldShow: true, patterns: [EMAIL_REGEX], fieldInfo: 'info.email.address' },
  'emailConfiguration.password': {
    label: 'emailConfiguration.password', placeHolderText: 'Email password', type: FIELD_TYPE.PASSWORD, errorMessage: 'Enter email password', shouldShow: true, fieldInfo: 'info.email.password' },
  'emailConfiguration.smtpHost': {
    label: 'emailConfiguration.smtpHost', placeHolderText: 'SMTP host name', type: FIELD_TYPE.TEXT, errorMessage: 'Enter valid smtp host or ip address', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.email.smtp.host' },
  'emailConfiguration.smtpPort': {
    label: 'emailConfiguration.smtpPort', placeHolderText: 'SMTP port', type: FIELD_TYPE.NUMBER, errorMessage: 'Enter valid smtp port', shouldShow: true, fieldInfo: 'info.email.smtp.port', defaultValue: CONSTANT_NUMBERS.MIN_VALUE, min: CONSTANT_NUMBERS.MIN_VALUE, max: CONSTANT_NUMBERS.MAX_PORT_VALUE },
  'emailConfiguration.insecureSkipVerify': {
    label: 'emailConfiguration.insecureSkipVerify', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.email.skip.ssl' },
  'emailConfiguration.isValidate': {
    label: 'emailConfiguration.isValidate', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.recepient.checkbox' },
  'emailConfiguration.recipientEmail': {
    label: 'Recipient Email', placeHolderText: 'Recipient email address', type: FIELD_TYPE.TEXT, errorMessage: 'Enter valid email address', shouldShow: (user) => showRecipientEmailField(user), patterns: [EMAIL_REGEX], fieldInfo: 'info.recipient.email.address' },
  // 'emailConfiguration.replicateConfig': {
  //   label: 'emailConfiguration.replicateConfig', description: 'Replicate configuration on connected sites', placeHolderText: 'Replicate configuration on connected sites', type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.email.replicate.config' },
  'emailRecipient.emailAddress': {
    label: 'emailRecipient.emailAddress', placeHolderText: 'Email address of recipient', type: FIELD_TYPE.TEXT, shouldShow: true, errorMessage: 'Enter valid email address', patterns: [EMAIL_REGEX], fieldInfo: 'info.email.recipient.address' },
  'emailRecipient.subscribedEvents': {
    label: 'emailRecipient.subscribedEvents', placeHolderText: 'Subscribed events for email address', COMPONENT: MULTISELECT_ITEM_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, errorMessage: 'Select at least one event type', validate: (value, user) => isEmpty(value, user), options: (user) => getEventOptions(user), fieldInfo: 'info.email.recipient.event' },
  // Report
  // 'report.startDate': { label: 'report.startDate', description: 'Starting date for report', COMPONENT: DATE_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  // 'report.endDate': { label: 'report.endDate', description: 'End date for report', COMPONENT: DATE_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  'report.system.includeSystemOverView': { label: 'report.includeSystemOverView', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.system.includeNodes': { label: 'report.includeNodes', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.system.includeEvents': { label: 'report.includeEvents', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.system.includeAlerts': { label: 'report.includeAlerts', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.protectionPlan.protectionPlans': { label: 'report.protectionPlans', COMPONENT: REPORT_PRTECTION_PLAN_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: () => true, options: (user, dispatch) => getReportProtectionPlans(user, dispatch), errorMessage: 'Select protection plan.', validate: (value, user) => isEmpty(value, user) },
  // 'report.protectionPlan.sites': { label: 'Sites', description: 'Include sites in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: true },
  'report.protectionPlan.includeProtectedVMS': { label: 'report.includeProtectedVMS', description: 'Add sites in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.protectionPlan.includeCheckpoints': { label: 'report.includeCheckpoints', description: 'Add sites in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.protectionPlan.includeReplicationJobs': { label: 'report.includeReplicationJobs', description: 'Add replication jobs in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.protectionPlan.replJobOption': { label: 'Filter', COMPONENT: REPORT_PRTECTION_PLAN_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: (user) => showReplOption(user), options: () => [{ label: 'All', value: 'all' }, { label: 'Exceed Interval', value: 'Exceeded-interval' }], errorMessage: 'Select protection plan.', validate: (value, user) => isEmpty(value, user) },
  'report.protectionPlan.includeRecoveryJobs': { label: 'report.includeRecoveryJobs', description: 'Add recovery jobs in report ', type: FIELD_TYPE.CHECKBOX, shouldShow: true },
  'report.protectionPlan.recoveryJobOption': { label: 'Filter', COMPONENT: REPORT_PRTECTION_PLAN_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: (user) => showRecoveryOption(user), options: () => [{ label: 'All', value: 'all' }, { label: 'Test Recovery', value: 'test recovery' }, { label: 'Full Recovery', value: 'full recovery' }, { label: 'Migration', value: 'migration' }, { label: 'Cleanup Recovery', value: 'cleanup recovery' }, { label: 'Cleanup Test Recovery', value: 'cleanup test recovery' }], errorMessage: 'Select protection plan.', validate: (value, user) => isEmpty(value, user) },
  'report.duration.type': { label: 'report.duration', type: FIELD_TYPE.SELECT, shouldShow: true, options: (user) => getReportDurationOptions(user), defaultValue: 'month' },
  'report.duration.startDate': { label: 'report.startDate', COMPONENT: DATE_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: (user) => showReportDurationDate(user), validate: (value, user) => isEmpty(value, user), maxDate: true },
  'report.duration.endDate': { label: 'report.endDate', COMPONENT: DATE_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: (user) => showReportDurationDate(user), validate: (value, user) => isEmpty(value, user), maxDate: true, minDate: ({ user }) => setMinDateForReport({ user }) },
  'report.format.type': { label: 'report.format', type: FIELD_TYPE.SELECT, shouldShow: true, options: () => [{ label: 'PDF', value: 'pdf' }, { label: 'Excel', value: 'excel' }], defaultValue: 'pdf', validate: (value, user) => isEmpty(value, user), errorMessage: 'Report format is required', fieldInfo: 'schedule.report.format.info' },
  'schedule.report.email': { label: 'Email Recipient', placeHolderText: '', type: FIELD_TYPE.TEXT, shouldShow: true, validate: (value, user) => isEmpty(value, user), errorMessage: 'Email address is required' },

  // Reverse
  'reverse.name': { label: 'name', placeHolderText: 'Name', type: FIELD_TYPE.LABEL, shouldShow: true },
  'reverse.protectedSite': { label: 'protect.site', placeHolderText: 'Protect Site', type: FIELD_TYPE.LABEL, shouldShow: true },
  'reverse.recoverySite': { label: 'recovery.site', placeHolderText: 'Recovery Site', type: FIELD_TYPE.SELECT, options: (user, fieldKey) => getSitesOptions(user, fieldKey), errorMessage: 'Select recovery site.', shouldShow: true, validate: (user) => validateDrSiteSelection(user), defaultValue: (user) => getDefaultRecoverySite(user), errorFunction: ({ user, value, fieldKey }) => validatePlanSiteSelection({ user, value, fieldKey }) },
  'reverse.interval': { label: 'replication.interval', placeHolderText: 'Replication Interval', type: FIELD_TYPE.LABEL, shouldShow: true },
  'reverse.suffix': { label: 'reverse.suffix', placeHolderText: 'Recovery Machines Suffix', type: FIELD_TYPE.TEXT, shouldShow: (user) => showRevPrefix(user), validate: (value, user) => isEmpty(value, user), errorMessage: 'Recovery machines suffix is required', fieldInfo: 'Original source VM name will be renamed as VM name-<SUFFIX>' },
  // Throttling
  'throttling.isLimitEnabled': { label: 'throttling.isLimitEnabled', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, onChange: (user, dispatch) => onLimitChange(user, dispatch) },
  'throttling.bandwidthLimit': { label: 'throttling.bandwidthLimit', description: 'Bandwidth in Mbps', defaultValue: 0, min: 0, max: 1000, type: FIELD_TYPE.RANGE, errorMessage: 'Bandwidth is required', shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  'throttling.applyToAll': { label: 'throttling.applyToAll', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: true },
  'throttling.startTime': { label: 'throttling.startTime', COMPONENT: TIME_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  'throttling.endTime': { label: 'throttling.endTime', COMPONENT: TIME_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  'throttling.isTimeEnabled': { label: 'throttling.isTimeEnabled', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false, onChange: (user, dispatch) => onTimeLimitChange(user, dispatch) },
  'throttling.timeLimit': { label: 'throttling.timeLimit', description: 'Bandwidth in Mbps', defaultValue: 0, min: 0, max: 1000, type: FIELD_TYPE.RANGE, errorMessage: 'Bandwidth is required', shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  // test recovery flags
  'recovery.runPPlanScripts': { label: 'run.protection.plan.scripts', type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.test.recovery.runPPlanScripts', defaultValue: false },
  'recovery.cleanupTestRecoveries': { label: 'cleanup.test.recoveries', type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.test.recovery.cleanupTestRecoveries', defaultValue: false },
  'drplan.vms': { label: '', type: FIELD_TYPE.TREE, isMultiSelect: true, errorMessage: 'Please select virtual machine for protection', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.protection.protectionVm', getTreeData: ({ dataKey, values, fieldKey }) => getVMwareVMSelectionData({ dataKey, values, fieldKey }), baseURL: 'api/v1/sites/<id>/resources', baseURLIDReplace: '<id>:ui.values.protectionSiteID', urlParms: ['type', 'entity'], urlParmKey: ['static:Folder,VirtualMachine', 'object:value'], dataKey: 'ui.site.vms.data', enableSelection: (node) => enableNodeTypeVM(node), loadChildDta: ({ dataKey, field, node }) => loadTreeChildData(dataKey, node, field) },
  'ui.automate.migration': { label: 'auto.migration', type: FIELD_TYPE.CHECKBOX, shouldShow: true, fieldInfo: 'info.auto.migration', default: false },
  'ui.new.password': { label: 'New Password', placeHolderText: 'Enter new password', type: FIELD_TYPE.PASSWORD, patterns: [PASSWORD_REGEX], errorMessage: 'Password should have atleast 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long and max of 32 characters.', shouldShow: true },
  'ui.cnfm.password': { label: 'Confirm Password', placeHolderText: 'Confirm password', type: FIELD_TYPE.PASSWORD, validate: (v, u) => validatePassword(v, u), errorMessage: 'New password and confirm password does not match', shouldShow: true },
  'ui.vm.recovery.checkpoints': { label: '', shouldShow: true, type: FIELD_TYPE.SELECT_SEARCH, options: (user, fieldKey, dispatch) => getVmCheckpointOptions(user, fieldKey, dispatch), validate: ({ value }) => isEmpty({ value }), errorMessage: 'Please select recovery checkpoint', defaultValue: (user, fieldKey, dispatch) => defaultRecoveryCheckpointForVm({ user, fieldKey, dispatch }), onChange: ({ value, dispatch, fieldKey, selectedOption }) => onVmRecoveryCheckpointOptionChange({ value, dispatch, fieldKey, selectedOption }) },
  'pplan.remove.checkpoint': { label: 'Remove Assosiated checkpoint', type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: false },
  'checkpoint.preserve': { label: 'Reason', validate: ({ value, user }) => isEmpty({ value, user }), placeHolderText: 'reson to preserve snapshot ', type: FIELD_TYPE.TEXT, shouldShow: true, errorMessage: 'Please provide Description', fieldInfo: 'Provide reason to preserve checkpoint' },
  'drplan.removeCheckpoint': { label: 'Remove Associated Checkpoints', validate: ({ value, user }) => isEmpty({ value, user }), placeHolderText: 'Delete Point In Time checkpoint of recovered vm/s', type: FIELD_TYPE.CHECKBOX, shouldShow: (user) => revShowRemoveCheckpointOption(user), errorMessage: 'Please provide Description', fieldInfo: 'Remove Point In Time checkpoints for the recovered vm/s' },
  // idp
  'configureIDP.name': { label: 'name', description: 'Name', placeHolderText: 'Enter name for the configuration', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Name required', shouldShow: true, fieldInfo: 'info.idp.name' },
  'configureIDP.attributes.email': { label: 'idp.attributes.email', placeHolderText: 'Enter email address', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'email required', shouldShow: true, fieldInfo: 'info.idp.attr.email' },
  'configureIDP.attributes.name': { label: 'name', placeHolderText: 'Enter name', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Name required', shouldShow: true, fieldInfo: 'info.idp.attr.name' },
  'configureIDP.attributes.role': { label: 'idp.attributes.role', placeHolderText: 'Enter role', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Role required', shouldShow: true, fieldInfo: 'info.idp.attr.role' },
  'configureIDP.metadataURL': { label: 'title.metadataurl', placeHolderText: 'Enter provider metadata url', type: FIELD_TYPE.TEXT, shouldShow: true, fieldInfo: 'info.idp.metadataurl' },
  'configureIDP.metadataFile': { label: 'title.metadata.file', type: FIELD_TYPE.LABEL, shouldShow: true, fieldInfo: 'info.idp.metadataurl' },
  'configureIDP.roleMaps': { label: 'roleMap', type: FIELD_TYPE.CUSTOM, shouldShow: true, fieldInfo: 'info.role.mapping', srcAltText: '', srcLabel: 'title.ad.role', tgtLabel: 'title.dm.role' },
  'configureUser.username': {
    label: 'username', placeHolderText: 'Username', type: FIELD_TYPE.TEXT, patterns: [USERNAME_REGEX], errorMessage: 'Username can contain only characters like A-Z a-z 0-9 - _ and at least 5 characters long and max of 20 characters', shouldShow: true, fieldInfo: 'info.user.name',
  },
  'configureUser.password': {
    label: 'password', placeHolderText: 'Enter Password', type: FIELD_TYPE.PASSWORD, patterns: [PASSWORD_REGEX], errorMessage: 'Password should have atleast 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters and max of 32 characters.', shouldShow: true, fieldInfo: 'info.user.password',
  },
  'configureUser.fullName': {
    label: 'user.fullname', placeHolderText: 'Fullname', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Full name is required', shouldShow: true, fieldInfo: 'info.user.fullname',
  },
  'configureUser.email': {
    label: 'email', placeHolderText: 'Email', type: FIELD_TYPE.TEXT, patterns: [EMAIL_REGEX], errorMessage: 'Email address is required', shouldShow: true, fieldInfo: 'info.user.email',
  },
  'configureUser.description': {
    label: 'description', placeHolderText: 'Description', type: FIELD_TYPE.TEXT, shouldShow: true, fieldInfo: 'info.user.description',
  },
  'configureUser.role': {
    label: 'user.role', placeHolderText: 'Select Role', type: FIELD_TYPE.SELECT, options: (user) => userRoleOptions(user), validate: (value, user) => isEmpty(value, user), errorMessage: 'User Role required', shouldShow: true, fieldInfo: 'info.user.role',
  },
  'reset.oldPassword': {
    label: 'password', placeHolderText: 'Enter Password', type: FIELD_TYPE.PASSWORD, patterns: [PASSWORD_REGEX], errorMessage: 'Password should have atleast 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character and be at least 8 characters long and max of 32 characters.', shouldShow: true, fieldInfo: 'info.reset.password',
  },
  'ui.reset.disk.replication': { label: 'Select All', type: FIELD_TYPE.CHECKBOX, shouldShow: true, default: false },
  'ui.common.checkpoint': { shouldShow: true, type: FIELD_TYPE.SELECT_SEARCH, options: (user) => commonCheckpointOptions(user), validate: true, errorMessage: '', onChange: ({ value, fieldKey, dispatch }) => onCommonCheckpointChange({ value, dispatch, fieldKey }), fieldInfo: 'common.checkpoint.info' },
  'ui.vm.replication.type': { label: '', shouldShow: true, type: FIELD_TYPE.SELECT, options: (user, fieldKey, dispatch) => getVmReplicationTypeOptions(user, fieldKey, dispatch), validate: ({ value }) => isEmpty({ value }), errorMessage: 'Please select replication type', defaultValue: (user, fieldKey, dispatch) => defaultReplicationTypeForVm({ user, fieldKey, dispatch }), hasWarningFunc: (user, fieldKey, fieldName) => hasWarning(user, fieldKey, fieldName) },
  'ui.vm.entity.type': { label: '', shouldShow: true, type: FIELD_TYPE.SELECT, options: (user, fieldKey, dispatch) => getVmEntityTypeOptions(user, fieldKey, dispatch), validate: ({ value }) => isEmpty({ value }), errorMessage: 'Please select entity type', defaultValue: (user, fieldKey, dispatch) => defaultEntityTypeForVm({ user, fieldKey, dispatch }), hasWarningFunc: (user, fieldKey, fieldName) => hasWarning(user, fieldKey, fieldName) },
  'ui.report.schedule.name': { label: '', placeHolderText: '', type: FIELD_TYPE.TEXT, errorMessage: 'Enter schedule name', shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  'ui.report.schedule.occurrence': { label: '', placeHolderText: '', type: FIELD_TYPE.NUMBER, validate: (value, user) => isEmpty(value, user), errorMessage: 'Enter Occurrence.', shouldShow: true, min: 1, getMinMax: (user) => getMinMaxForReportSchedulerOccurence(user), defaultValue: 1 },
  'ui.report.schedule.day': { label: '', onChange: onReportOccurrenceChange, errorMessage: 'Select Occurrence', options: [{ label: 'Hourly', value: 'hour' }, { label: 'Daily', value: 'day' }, { label: 'Weekly', value: 'week' }, { label: 'Monthly', value: 'month' }], shouldShow: true, validate: (value, user) => isEmpty(value, user), defaultValue: 'week' },
  'ui.report.schedule.day.of.month': { label: '', placeHolderText: '', type: FIELD_TYPE.NUMBER, validate: (value, user) => isEmpty(value, user), errorMessage: 'Enter day of month.', shouldShow: (fieldkey, user) => showReportDayOfMonthField(fieldkey, user), defaultValue: 1, min: 1, max: 30 },
  'ui.report.schedule.time': { label: '', COMPONENT: TIME_PICKER_COMP, type: FIELD_TYPE.CUSTOM, shouldShow: true, validate: (value, user) => isEmpty(value, user) },
  'ui.report.maintain.copies': { label: '', placeHolderText: '', type: FIELD_TYPE.NUMBER, validate: (value, user) => isEmpty(value, user), errorMessage: 'Enter maintain copies', shouldShow: true, min: 1, defaultValue: 1, getMinMax: (user) => getMinMaxForReportSchedulerMaintanance(user) },
  'ui.report.schedule.time.zone': { label: '', type: FIELD_TYPE.SELECT_SEARCH, shouldShow: true, options: (user) => getTimeZoneOptions(user), validate: (value, u) => isEmpty(value, u), errorMessage: 'Select Zone', defaultValue: (user, fieldKey, dispatch) => defaultReportScheduleTimeZone({ user, fieldKey, dispatch }) },
  'stop.repl.reason': {
    label: 'Reason', placeHolderText: 'Reason', type: FIELD_TYPE.TEXT, maxLength: 128, shouldShow: true, fieldInfo: 'Please provide reason', validate: (value, user) => isEmpty(value, user), errorMessage: 'pleas', errorFunction: errorMessageForReasonInReplOp,
  },
};
