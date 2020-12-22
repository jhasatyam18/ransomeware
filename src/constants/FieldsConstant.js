import { isPlatformTypeAWS, isPlatformTypeGCP, isPlatformTypeVMware } from '../utils/InputUtils';
import { isEmpty } from '../utils/validationUtils';
import { HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX, IP_REGEX } from './ValidationConstants';

export const CONFIURE_SITE_GROUP = ['configureSite.platformDetails.type', 'configureSite.platformDetails.platformName'];
export const FIELD_TYPE = {
  CHECKBOX: 'CHECKBOX', TEXT: 'TEXT', SELECT: 'SELECT', NUMBER: 'NUMBER', PASSOWRD: 'PASSWORD',
};
export const FIELDS = {
  // CONFIGURE SITE FIELDS
  'configureSite.siteType': {
    label: 'Site Type', placeHolderText: 'Select Site', type: FIELD_TYPE.SELECT, options: [{ label: 'Protect', value: 'Protect' }, { label: 'Recovery', value: 'Recovery' }], validate: null, errorMessage: '', shouldShow: true,
  },
  'configureSite.platformDetails.platformType': {
    label: 'Platform Type', description: 'Select Platform Type', type: FIELD_TYPE.SELECT, options: [{ label: 'VMware', value: 'VMware' }, { label: 'AWS', value: 'AWS' }, { label: 'GCP', value: 'GCP' }], validate: (value, user) => isEmpty(value, user), errorMessage: 'Select Platform Type', shouldShow: true,
  },
  'configureSite.platformDetails.platformName': {
    label: 'Platform Name', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform name required', shouldShow: true,
  },
  'configureSite.Description': {
    label: 'Description', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Site Description Required', shouldShow: true,
  },
  'configureSite.platformDetails.hostname': {
    label: 'vCenter Server IP', description: '', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid IP address', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.port': {
    label: 'Port', description: '', type: FIELD_TYPE.NUMBER, errorMessage: 'Required', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.username': {
    label: 'Username', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Username Required', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.password': {
    label: 'Password', description: '', type: FIELD_TYPE.PASSOWRD, validate: (value, user) => isEmpty(value, user), errorMessage: 'Password Required', shouldShow: (user) => isPlatformTypeVMware(user),
  },
  'configureSite.platformDetails.region': {
    label: 'Region', description: '', type: FIELD_TYPE.TEXT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Required', shouldShow: (user) => isPlatformTypeAWS(user),
  },
  'configureSite.platformDetails.availZone': {
    label: 'Zone', description: '', type: FIELD_TYPE.TEXT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Required', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  },
  'configureSite.platformDetails.secretKey': {
    label: 'Secret Key', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), shouldShow: (user) => isPlatformTypeAWS(user),
  },
  'configureSite.platformDetails.accessKey': {
    label: 'Access Key', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Required', shouldShow: (user) => isPlatformTypeAWS(user),
  },
  'configureSite.platformDetails.projectId': {
    label: 'Project ID', description: '', type: FIELD_TYPE.TEXT, patterns: [HOSTNAME_FQDN_REGEX, HOSTNAME_IP_REGEX], errorMessage: 'Required', shouldShow: (user) => isPlatformTypeGCP(user),
  },
  'configureSite.platformDetails.serverIp': {
    label: 'Datamotive Server IP', description: '', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid IP address', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  },
  'configureSite.platformDetails.serverPort': {
    label: 'Server Port', description: '', type: FIELD_TYPE.NUMBER, errorMessage: 'Required', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  },
  'configureSite.platformDetails.prepMachineIP': {
    label: 'Preparation Machine IP', description: '', type: FIELD_TYPE.TEXT, patterns: [IP_REGEX], errorMessage: 'Enter valid Machine IP address', shouldShow: (user) => isPlatformTypeAWS(user) || isPlatformTypeGCP(user),
  },

  'TEST.site.platformName': {
    label: 'Platform Name', description: '', type: FIELD_TYPE.TEXT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Platform name required',
  },
};
